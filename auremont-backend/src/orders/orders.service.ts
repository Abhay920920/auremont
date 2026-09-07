/* eslint-disable no-await-in-loop */
/* eslint-disable max-lines-per-function, complexity */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PaymentsService } from '../payments/payments.service';
import { Order, Prisma, PayStatus } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as crypto from 'crypto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private userOrdersCache = new Map<string, { data: any; expiresAt: number }>();
  private userOrdersInflight = new Map<string, Promise<any>>();
  private readonly USER_ORDERS_TTL_MS = 5000;

  private adminOrdersCache = new Map<string, { data: any; expiresAt: number }>();
  private adminOrdersInflight = new Map<string, Promise<any>>();
  private readonly ADMIN_ORDERS_TTL_MS = 15000;

  invalidateAdminOrders() {
    this.adminOrdersCache.clear();
    this.adminOrdersInflight.clear();
  }

  invalidateUserOrders(userId?: string) {
    if (userId) {
      this.userOrdersCache.delete(`orders:user:${userId}`);
    }
    this.invalidateAdminOrders();
  }

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private payments: PaymentsService,
    private notifications: NotificationsService,
  ) {}

  private validateIdempotencyPayload(
    existingOrder: any,
    currentData: {
      userId?: string;
      cartItems: { productId: string; quantity: number }[];
      address: any;
      couponId?: string;
    },
  ): boolean {
    if (currentData.userId && existingOrder.userId !== currentData.userId) {
      return false;
    }
    if ((currentData.couponId || null) !== (existingOrder.couponId || null)) {
      return false;
    }
    if (!existingOrder.items || existingOrder.items.length !== currentData.cartItems.length) {
      return false;
    }
    const sortedExisting = [...existingOrder.items].sort((a, b) => a.productId.localeCompare(b.productId));
    const sortedCurrent = [...currentData.cartItems].sort((a, b) => a.productId.localeCompare(b.productId));
    for (let i = 0; i < sortedExisting.length; i++) {
      if (
        sortedExisting[i].productId !== sortedCurrent[i].productId ||
        sortedExisting[i].quantity !== sortedCurrent[i].quantity
      ) {
        return false;
      }
    }
    if (existingOrder.address && currentData.address) {
      const existPhone = (existingOrder.address.phone || '').replace(/\D/g, '');
      const currPhone = (currentData.address.phone || '').replace(/\D/g, '');
      if (existPhone && currPhone && existPhone !== currPhone) {
        return false;
      }
      if (
        existingOrder.address.postalCode &&
        currentData.address.postalCode &&
        existingOrder.address.postalCode !== currentData.address.postalCode
      ) {
        return false;
      }
    }
    return true;
  }

  async createOrder(data: {
    userId?: string;
    guestEmail?: string;
    cartId: string;
    couponId?: string;
    idempotencyKey?: string;
    address: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }, timings: Record<string, number> = {}): Promise<Order & { payment?: any }> {
    const { userId, guestEmail, cartId, couponId, idempotencyKey, address } = data;
    const _t0 = process.hrtime.bigint();
    const mark = (name: string, from: bigint) => {
      const dur = Number(process.hrtime.bigint() - from) / 1e6;
      timings[name] = Math.round(dur * 100) / 100;
      return process.hrtime.bigint();
    };

    // ── Stage 1: Cart lookup ──
    let _t = process.hrtime.bigint();
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      select: {
        id: true,
        userId: true,
        status: true,
        items: {
          select: { id: true, productId: true, quantity: true, unitPrice: true },
        },
      },
    });
    _t = mark('cart_lookup_ms', _t);

    if (!cart) {
      throw new NotFoundException({ code: 'CART_NOT_FOUND', message: 'Cart not found.', _timings: timings });
    }

    if (cart.userId && cart.userId !== userId) {
      throw new ForbiddenException({ code: 'CART_ACCESS_DENIED', message: 'You do not have access to this cart.', _timings: timings });
    }

    // ── Stage 1b: Fast-path Idempotency Pre-Check (before reserving stock or creating guest) ──
    if (idempotencyKey) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true, address: true },
      });
      if (existingOrder) {
        const matches = this.validateIdempotencyPayload(existingOrder, {
          userId,
          cartItems: cart.items || [],
          address,
          couponId,
        });
        if (!matches) {
          throw new ConflictException({
            code: 'IDEMPOTENCY_PAYLOAD_MISMATCH',
            message: 'Idempotency key was previously used with a different request payload.',
            _timings: timings,
          });
        }
        mark('total_service_ms', _t0);
        (existingOrder as any)._timings = timings;
        return existingOrder;
      }
    }

    if (cart.status !== 'active') {
      throw new BadRequestException({ code: 'CART_NOT_ACTIVE', message: 'Cart is no longer active.', _timings: timings });
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException({ code: 'EMPTY_CART', message: 'Cannot create an order from an empty cart.', _timings: timings });
    }

    const isMockEnv = Boolean((this.prisma as any)._getDb);
    const sortedItems = [...cart.items].sort((a, b) => a.productId.localeCompare(b.productId));
    const reservedItems: { productId: string; quantity: number }[] = [];
    const orderItems: any[] = [];
    const inventoryLogs: any[] = [];
    let subtotal = new Prisma.Decimal(0);

    // ── Stage 2: In production, atomic reservation happens FIRST (standalone query, ~5ms lock) ──
    // Out-of-stock buyers fail immediately without creating guest users or holding locks.
    if (!isMockEnv) {
      const _tInv = process.hrtime.bigint();
      for (const item of sortedItems) {
        let updatedRows: any[] = [];
        let attempt = 0;
        const maxRetries = 2;

        while (true) {
          try {
            updatedRows = await (this.prisma as any).$queryRaw(
              Prisma.sql`UPDATE "products"
                         SET "stock_qty" = "stock_qty" - ${item.quantity}
                         WHERE "id" = ${item.productId}::uuid AND "stock_qty" >= ${item.quantity}
                         RETURNING id, "stock_qty", price, "sale_price", name, sku, "thumbnail_url"`
            );
            break;
          } catch (err: any) {
            const isTransient = err.message?.includes("Can't reach database server") ||
                                err.message?.includes('connection pool') ||
                                err.message?.includes('Timed out fetching') ||
                                err.code === 'P1001' ||
                                err.code === 'P2024' ||
                                err.code === 'P2028';
            if (isTransient && attempt < maxRetries) {
              attempt++;
              await new Promise(r => setTimeout(r, 50 * attempt + Math.floor(Math.random() * 50)));
              continue;
            }
            throw err;
          }
        }

        if (!updatedRows || updatedRows.length === 0) {
          if (reservedItems.length > 0) {
            await Promise.all(
              reservedItems.map((r) =>
                this.prisma.product.update({
                  where: { id: r.productId },
                  data: { stockQty: { increment: r.quantity } },
                }).catch(() => {})
              )
            );
          }
          mark('inv_atomic_check_ms', _tInv);
          throw new ConflictException({
            code: 'INSUFFICIENT_STOCK',
            message: `Insufficient stock for product ${item.productId}`,
            _timings: timings,
          });
        }

        reservedItems.push({ productId: item.productId, quantity: item.quantity });
        const prod = updatedRows[0];
        const salePrice = prod.salePrice ?? prod.sale_price;
        const finalPrice = salePrice !== null && salePrice !== undefined ? salePrice : prod.price;
        if (finalPrice === null || finalPrice === undefined || Number.isNaN(Number(finalPrice))) {
          throw new BadRequestException(`Invalid price detected for product ${prod.id}`);
        }

        const unitPrice = new Prisma.Decimal(finalPrice);
        const itemSubtotal = unitPrice.mul(item.quantity);
        subtotal = subtotal.add(itemSubtotal);

        orderItems.push({
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          imageUrl: prod.thumbnailUrl ?? prod.thumbnail_url,
          quantity: item.quantity,
          price: unitPrice,
          subtotal: itemSubtotal,
        });
        inventoryLogs.push({ productId: prod.id, changeQty: -item.quantity, reason: 'order_placed' });
      }
      mark('inv_atomic_check_ms', _tInv);
    }

    // ── Stage 3: Guest user creation (only for winners who secured stock) ──
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const _tUser = process.hrtime.bigint();
      const nameParts = (address.fullName || 'Guest Customer').trim().split(' ');
      const firstName = nameParts[0] || 'Guest';
      const lastName = nameParts.slice(1).join(' ') || 'Customer';
      const guestInternalEmail = `guest_${Date.now()}_${crypto.randomBytes(4).toString('hex')}@guest.rarenuts.internal`;
      
      let userAttempt = 0;
      let guestUser: any;
      while (true) {
        try {
          guestUser = await this.prisma.user.create({
            data: { email: guestInternalEmail, firstName, lastName, role: 'customer' },
          });
          break;
        } catch (err: any) {
          const isTransient = err.message?.includes("Can't reach database server") ||
                              err.message?.includes('connection pool') ||
                              err.message?.includes('Timed out fetching') ||
                              err.code === 'P1001' ||
                              err.code === 'P2024' ||
                              err.code === 'P2028';
          if (isTransient && userAttempt < 2) {
            userAttempt++;
            await new Promise(r => setTimeout(r, 50 * userAttempt + Math.floor(Math.random() * 50)));
            continue;
          }
          throw err;
        }
      }
      effectiveUserId = guestUser.id;
      mark('guest_user_create_ms', _tUser);
    } else {
      timings['guest_user_create_ms'] = 0;
    }

    let createdOrder: any;

    // ── Stage 4: Transactional order creation ──
    const _tTx0 = process.hrtime.bigint();
    let txAttempt = 0;
    const maxTxRetries = 2;

    while (true) {
      try {
        createdOrder = await this.prisma.$transaction(async (tx) => {
          // In mock environment only: execute in-memory inventory reservation
          if (isMockEnv) {
            const _tInv = process.hrtime.bigint();
            for (const item of sortedItems) {
              const p = await tx.product.findUnique({ where: { id: item.productId } });
              const curStock = p ? (p.stockQty ?? (p as any).stock_qty ?? 0) : 0;
              if (!p || curStock < item.quantity) {
                mark('inv_atomic_check_ms', _tInv);
                throw new ConflictException({
                  code: 'INSUFFICIENT_STOCK',
                  message: `Insufficient stock for product ${item.productId}`,
                  _timings: timings,
                });
              }
              const updated = await tx.product.update({
                where: { id: item.productId },
                data: { stockQty: { decrement: item.quantity } },
              });
              const prod = {
                id: updated.id,
                stock_qty: updated.stockQty ?? (updated as any).stock_qty,
                price: updated.price,
                sale_price: updated.salePrice,
                name: updated.name,
                sku: updated.sku,
                thumbnail_url: updated.thumbnailUrl,
              };
              const salePrice = prod.sale_price;
              const finalPrice = salePrice !== null && salePrice !== undefined ? salePrice : prod.price;
              const unitPrice = new Prisma.Decimal(finalPrice);
              const itemSubtotal = unitPrice.mul(item.quantity);
              subtotal = subtotal.add(itemSubtotal);
              orderItems.push({
                productId: prod.id,
                productName: prod.name,
                sku: prod.sku,
                imageUrl: prod.thumbnail_url,
                quantity: item.quantity,
                price: unitPrice,
                subtotal: itemSubtotal,
              });
              inventoryLogs.push({ productId: prod.id, changeQty: -item.quantity, reason: 'order_placed' });
            }
            mark('inv_atomic_check_ms', _tInv);
          }

          // ── Step B: Coupon validation ──
          const _tCoupon = process.hrtime.bigint();
          let discount = new Prisma.Decimal(0);
          if (couponId) {
            let coupon: any = null;
            try {
              const couponRows = await (tx as any).$queryRaw(
                Prisma.sql`SELECT * FROM "coupons" WHERE id = ${couponId}::uuid FOR UPDATE`,
              );
              coupon = couponRows?.[0];
            } catch {
              coupon = await tx.coupon.findUnique({ where: { id: couponId } });
            }

            if (!coupon || !coupon.status) throw new BadRequestException('Coupon is invalid or no longer active');
            const now = new Date();
            const startDate = new Date(coupon.startDate ?? coupon.start_date);
            const endDate = new Date(coupon.endDate ?? coupon.end_date);
            if (now < startDate || now > endDate) throw new BadRequestException('Coupon is expired or not active yet');
            const minOrder = coupon.minimumOrder ?? coupon.minimum_order;
            if (minOrder && subtotal.lessThan(minOrder)) throw new BadRequestException(`Minimum order of ${minOrder} required for this coupon`);
            const usageLimit = coupon.usageLimit ?? coupon.usage_limit;
            if (usageLimit) {
              const usageCount = await tx.order.count({ where: { couponId: coupon.id } });
              if (usageCount >= usageLimit) throw new BadRequestException('Coupon usage limit reached');
            }

            const normalizedPhone = address.phone ? address.phone.replace(/\D/g, '') : '';
            const normalizedGuestEmail = (guestEmail || '').trim().toLowerCase();
            const usageConditions: any[] = [];
            if (userId) usageConditions.push({ userId });
            if (normalizedPhone && normalizedPhone.length >= 7) {
              const phoneSuffix = normalizedPhone.length >= 10 ? normalizedPhone.slice(-10) : normalizedPhone;
              usageConditions.push({ address: { phone: { contains: phoneSuffix } } });
            }
            if (normalizedGuestEmail && !normalizedGuestEmail.includes('@guest.rarenuts.internal')) {
              usageConditions.push({ user: { email: { equals: normalizedGuestEmail, mode: 'insensitive' } } });
            }
            if (usageConditions.length > 0) {
              const customerUsage = await tx.order.count({
                where: { couponId: coupon.id, orderStatus: { not: 'cancelled' }, OR: usageConditions },
              });
              if (customerUsage > 0) throw new BadRequestException('You have already used this coupon');
            }

            if (coupon.type === 'percentage') {
              discount = subtotal.mul(coupon.value).div(100);
              if (coupon.maxDiscount && discount.greaterThan(coupon.maxDiscount)) {
                discount = new Prisma.Decimal(coupon.maxDiscount);
              }
            } else {
              discount = new Prisma.Decimal(coupon.value);
            }
          }
          mark('coupon_lookup_ms', _tCoupon);

          // ── Step C: Totals ──
          const _tTotals = process.hrtime.bigint();
          const shipping = new Prisma.Decimal('0.00');
          const tax = subtotal.mul(new Prisma.Decimal('0.05'));
          let total = subtotal.add(shipping).add(tax).sub(discount);
          if (total.lessThan(0)) total = new Prisma.Decimal(0);
          mark('totals_calc_ms', _tTotals);

          // ── Step D: Address & Order Creation ──
          const _tAddr = process.hrtime.bigint();
          const newAddress = await tx.address.create({
            data: {
              userId: effectiveUserId,
              fullName: address.fullName,
              phone: address.phone,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
            },
          });
          mark('address_create_ms', _tAddr);

          const _tOrder = process.hrtime.bigint();
          const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          const order = await tx.order.create({
            data: {
              orderNumber,
              userId: effectiveUserId,
              addressId: newAddress.id,
              couponId: couponId ?? null,
              idempotencyKey: idempotencyKey ?? null,
              subtotal,
              discount: discount.greaterThan(0) ? discount : null,
              shipping,
              tax,
              total,
              paymentStatus: 'pending',
              orderStatus: 'placed',
              items: { create: orderItems },
            },
            select: {
              id: true,
              orderNumber: true,
              userId: true,
              addressId: true,
              couponId: true,
              subtotal: true,
              discount: true,
              shipping: true,
              tax: true,
              total: true,
              paymentStatus: true,
              orderStatus: true,
              idempotencyKey: true,
              paymentRef: true,
              createdAt: true,
              updatedAt: true,
            },
          });
          mark('order_create_ms', _tOrder);

          // Attach pre-calculated relations in-memory to avoid 2-3 extra DB round trips inside the transaction
          (order as any).items = orderItems.map((item, idx) => ({
            id: `item-${order.id}-${idx}`,
            orderId: order.id,
            ...item,
          }));
          (order as any).address = newAddress;

          return order;
        }, { maxWait: 30000, timeout: 60000 });
        break;
      } catch (err: any) {
        const isTransient = err.message?.includes("Can't reach database server") ||
                            err.message?.includes('connection pool') ||
                            err.message?.includes('Timed out fetching') ||
                            err.code === 'P1001' ||
                            err.code === 'P2024' ||
                            err.code === 'P2028';
        if (isTransient && txAttempt < maxTxRetries) {
          txAttempt++;
          await new Promise(r => setTimeout(r, 75 * txAttempt + Math.floor(Math.random() * 50)));
          continue;
        }

        // Compensating inventory rollback if order transaction failed
        if (reservedItems.length > 0) {
          await Promise.all(
            reservedItems.map((r) =>
              this.prisma.product.update({
                where: { id: r.productId },
                data: { stockQty: { increment: r.quantity } },
              }).catch(() => {})
            )
          );
        }
        // Idempotency replay: order already exists with this key
        if (err?.code === 'P2002' && (err?.meta?.target?.includes('idempotency') || err?.message?.includes('idempotency'))) {
          const existing = await this.prisma.order.findUnique({
            where: { idempotencyKey },
            include: { items: true, address: true },
          });
          if (existing) {
            const matches = this.validateIdempotencyPayload(existing, {
              userId,
              cartItems: cart.items,
              address,
              couponId,
            });
            if (!matches) {
              throw new ConflictException({
                code: 'IDEMPOTENCY_PAYLOAD_MISMATCH',
                message: 'Idempotency key was previously used with a different request payload.',
              });
            }
            return existing;
          }
        }
        if (err?.code === 'P2002' && err?.meta?.target?.includes('order_number')) {
          throw new ConflictException({ code: 'ORDER_NUMBER_COLLISION', message: 'Order creation collision, please retry.' });
        }
        throw err;
      }
    }

    mark('order_tx_total_ms', _tTx0);

    // ── Phase 2: Fire-and-forget non-critical side effects — do NOT await these, they add RTTs to the hot path ──
    mark('total_service_ms', _t0);
    const _orderId = createdOrder.id;
    const _orderNumber = createdOrder.orderNumber;
    const _effectiveUserId = effectiveUserId;
    setImmediate(() => {
      try {
        this.prisma.cart?.update?.({ where: { id: cartId }, data: { status: 'ordered' } })?.catch?.(() => {});
        if (inventoryLogs.length > 0) {
          this.prisma.inventoryLog?.createMany?.({
            data: inventoryLogs.map((log) => ({ ...log, referenceId: _orderId })),
          })?.catch?.(() => {});
        }
        (this.prisma as any).outboxEvent?.create?.({
          data: {
            eventType: 'order_created',
            payload: {
              orderId: _orderId,
              orderNumber: _orderNumber,
              userId: _effectiveUserId,
              total: createdOrder?.total?.toString?.() ?? String(createdOrder?.total ?? ''),
              guestEmail,
            },
          },
        })?.catch?.(() => {});
      } catch {
        // Suppress unhandled exceptions in background fire-and-forget tasks
      }
    });

    // Asynchronous non-critical user profile sync
    if (userId && address.phone && this.prisma.user?.update) {
      Promise.resolve(
        this.prisma.user.update({
          where: { id: userId },
          data: { phone: address.phone },
        })
      ).catch(() => {});
    }

    this.invalidateUserOrders(effectiveUserId);
    if (createdOrder) {
      createdOrder._timings = timings;
    }
    return createdOrder;
  }

  async initializePayment(orderId: string, amount: number, existingPaymentRef?: string) {
    try {
      if (existingPaymentRef) {
        return {
          paymentProvider: 'razorpay',
          razorpayOrderId: existingPaymentRef,
          amount: Math.round(amount * 100),
          currency: 'INR',
        };
      }
      return await this.payments.createRazorpayOrder(orderId, amount);
    } catch (err) {
      // Log but don't fail the checkout — order is already created
      console.error('Payment initialization failed:', (err as any).message);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const cacheKey = `orders:user:${userId}`;
    const cached = this.userOrdersCache.get(cacheKey);
    if (cached && Date.now() <= cached.expiresAt) return cached.data;
    if (this.userOrdersInflight.has(cacheKey)) return this.userOrdersInflight.get(cacheKey);

    const fetchPromise = (async () => {
      // Lean select — orderItems have snapshot fields (productName, sku, imageUrl)
      // so we don't need to join products table at all
      return this.prisma.order.findMany({
        where: { userId },
        select: {
          id: true, orderNumber: true, userId: true, subtotal: true, discount: true,
          shipping: true, tax: true, total: true, paymentStatus: true, orderStatus: true,
          createdAt: true, updatedAt: true, couponId: true, paymentRef: true,
          items: {
            select: {
              id: true, productId: true, productName: true, sku: true,
              imageUrl: true, quantity: true, price: true, subtotal: true,
            },
          },
          address: {
            select: {
              id: true, fullName: true, phone: true, addressLine1: true,
              addressLine2: true, city: true, state: true, postalCode: true, country: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }) as unknown as Promise<Order[]>;
    })().finally(() => {
      this.userOrdersInflight.delete(cacheKey);
    });

    this.userOrdersInflight.set(cacheKey, fetchPromise);
    const result = await fetchPromise;
    this.userOrdersCache.set(cacheKey, { data: result, expiresAt: Date.now() + this.USER_ORDERS_TTL_MS });
    return result;
  }

  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true, orderNumber: true, userId: true, subtotal: true, discount: true,
        shipping: true, tax: true, total: true, paymentStatus: true, orderStatus: true,
        createdAt: true, updatedAt: true, couponId: true, paymentRef: true,
        items: {
          select: {
            id: true, productId: true, productName: true, sku: true,
            imageUrl: true, quantity: true, price: true, subtotal: true,
          },
        },
        address: {
          select: {
            id: true, fullName: true, phone: true, addressLine1: true,
            addressLine2: true, city: true, state: true, postalCode: true, country: true,
          },
        },
      },
    }) as any;
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('You do not have permission to view this order');
    return order;
  }

  async getOrderByIdAdmin(orderId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        address: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order as any;
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Row lock to serialize concurrent cancellation requests and prevent TOCTOU race
      let lockedOrder: any = null;
      try {
        const lockedRows = await tx.$queryRaw<any[]>(
          Prisma.sql`SELECT id, "order_status", "payment_status", "user_id", "order_number"
                     FROM "orders"
                     WHERE id = ${orderId}::uuid FOR UPDATE`
        );
        lockedOrder = lockedRows?.[0];
      } catch {
        // Fallback for mock/test environments
        lockedOrder = await tx.order.findUnique({ where: { id: orderId } });
      }

      if (!lockedOrder) {
        throw new NotFoundException('Order not found');
      }

      const orderUserId = lockedOrder.user_id ?? lockedOrder.userId;
      if (orderUserId !== userId) {
        throw new ForbiddenException('You do not have permission to cancel this order');
      }

      const paymentStatus = lockedOrder.payment_status ?? lockedOrder.paymentStatus;
      if (paymentStatus === 'paid') {
        throw new BadRequestException(
          'Cannot cancel a paid order. Please contact support to initiate a refund.',
        );
      }

      const orderStatus = lockedOrder.order_status ?? lockedOrder.orderStatus;
      if (['shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
        throw new BadRequestException(`Cannot cancel an order with status ${orderStatus}`);
      }

      // Fetch items inside transaction lock to guarantee accurate restoration
      const orderWithItems = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      const shouldRestoreInventory = paymentStatus !== 'failed';

      const ops: Promise<any>[] = [
        tx.order.update({
          where: { id: orderId },
          data: {
            orderStatus: 'cancelled',
            paymentStatus: 'cancelled', // Explicitly mark payment cancelled for display
          },
        }),
      ];

      if (shouldRestoreInventory && orderWithItems?.items && orderWithItems.items.length > 0) {
        ops.push(
          ...orderWithItems.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { stockQty: { increment: item.quantity } },
            })
          ),
        );
        ops.push(
          tx.inventoryLog.createMany({
            data: orderWithItems.items.map((item) => ({
              productId: item.productId,
              changeQty: item.quantity,
              reason: 'order_cancelled',
              referenceId: orderId,
            })),
          }),
        );
      }

      const [cancelledOrder] = await Promise.all(ops);
      return {
        cancelledOrder,
        orderNumber: lockedOrder.order_number ?? lockedOrder.orderNumber,
        orderUserId,
      };
    }, { maxWait: 10000, timeout: 20000 });

    // Send notification outside lock
    await this.notifications.create(
      result.orderUserId,
      'order_cancelled',
      'Order Cancelled',
      `Your order #${result.orderNumber} has been successfully cancelled.`
    );

    this.invalidateUserOrders(result.orderUserId);
    return result.cancelledOrder;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async getAllOrders(query: any): Promise<{ data: Order[]; total: number }> {
    const { status, paymentStatus, page = 1, limit = 20, search } = query;
    const cacheKey = `orders:admin:${page}:${limit}:${status || ''}:${paymentStatus || ''}:${search || ''}`;
    const cached = this.adminOrdersCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    if (this.adminOrdersInflight.has(cacheKey)) {
      return this.adminOrdersInflight.get(cacheKey);
    }

    const fetchPromise = (async () => {
      const where: any = {};
      if (status) where.orderStatus = status;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [data, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        this.prisma.order.count({ where }),
      ]);

      const result = { data, total };
      this.adminOrdersCache.set(cacheKey, { data: result, expiresAt: Date.now() + this.ADMIN_ORDERS_TTL_MS });
      return result;
    })().finally(() => {
      this.adminOrdersInflight.delete(cacheKey);
    });

    this.adminOrdersInflight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto, adminId?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    this.invalidateAdminOrders();

    const current = order.orderStatus;
    const target = dto.status;

    // Idempotent no-op
    if (current === target) {
      return order;
    }

    // Authoritative State Machine Transitions
    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['packed', 'cancelled'],
      packed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [], // Terminal state
      cancelled: [], // Terminal state
    };

    const allowed = ALLOWED_TRANSITIONS[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Invalid state transition: Cannot transition order #${order.orderNumber} from '${current}' to '${target}'.`,
      );
    }

    // Invariant: Order confirmation requires paymentStatus === 'paid'
    if (target === 'confirmed' && order.paymentStatus !== 'paid') {
      throw new BadRequestException(
        `Cannot confirm order #${order.orderNumber}: paymentStatus is '${order.paymentStatus}', expected 'paid'.`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: dto.status },
    });

    // Send notification (only for registered users, guest orders have no userId)
    if (order.userId) {
      try {
        const friendlyStatus = dto.status.charAt(0).toUpperCase() + dto.status.slice(1);
        await this.notifications.create(
          order.userId,
          'order_update',
          `Order ${friendlyStatus}`,
          `Your order #${order.orderNumber} is now ${dto.status}.`
        );
      } catch (err) {
        console.warn('Failed to send order status notification:', err);
      }
    }

    if (adminId) {
      try {
        await this.audit.log({ userId: adminId, action: 'UPDATE_ORDER_STATUS', entity: 'Order', entityId: orderId });
      } catch (err) {
        console.warn('Failed to record audit log for order status update:', err);
      }
    }

    return updatedOrder;
  }

  async updatePaymentStatus(orderId: string, status: PayStatus, adminId?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    this.invalidateAdminOrders();

    if (order.paymentStatus === 'paid' && (status === 'pending' || status === 'failed')) {
      throw new BadRequestException(`Cannot downgrade payment status from 'paid' to '${status}'.`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });

    if (adminId) {
      try {
        await this.audit.log({ userId: adminId, action: 'UPDATE_PAYMENT_STATUS', entity: 'Order', entityId: orderId });
      } catch (err) {
        console.warn('Failed to record audit log for payment status update:', err);
      }
    }

    return updatedOrder;
  }
}
