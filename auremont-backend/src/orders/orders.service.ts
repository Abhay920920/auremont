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
import { Order, Prisma } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as crypto from 'crypto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private userOrdersCache = new Map<string, { data: any; expiresAt: number }>();
  private userOrdersInflight = new Map<string, Promise<any>>();
  private readonly USER_ORDERS_TTL_MS = 5000;

  invalidateUserOrders(userId?: string) {
    if (userId) {
      this.userOrdersCache.delete(`orders:user:${userId}`);
    }
  }

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private payments: PaymentsService,
    private notifications: NotificationsService,
  ) {}

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
  }): Promise<Order & { payment?: any }> {
    const { userId, guestEmail, cartId, couponId, idempotencyKey, address } = data;

    // Idempotency check — lean select, no need to load full product rows for a replay response
    if (idempotencyKey) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        select: {
          id: true, orderNumber: true, userId: true, addressId: true,
          couponId: true, subtotal: true, discount: true, shipping: true,
          tax: true, total: true, paymentStatus: true, orderStatus: true,
          idempotencyKey: true, paymentRef: true, createdAt: true, updatedAt: true,
          items: {
            select: {
              id: true, orderId: true, productId: true, productName: true,
              sku: true, imageUrl: true, quantity: true, price: true, subtotal: true,
            },
          },
          address: {
            select: {
              id: true, fullName: true, phone: true, addressLine1: true,
              addressLine2: true, city: true, state: true, postalCode: true, country: true,
            },
          },
        },
      });
      if (existingOrder) {
        return existingOrder as any;
      }
    }

    // Resolve or create user ID for guest orders
    let effectiveUserId = userId;

    // ── Phase 1: Parallel pre-flight validation (single concurrent WAN round-trip) ──
    const [cart] = await Promise.all([
      this.prisma.cart.findUnique({
        where: { id: cartId },
        select: {
          id: true,
          userId: true,
          status: true,
          items: {
            select: { id: true, productId: true, quantity: true, unitPrice: true },
          },
        },
      }),
    ]);

    if (!effectiveUserId) {
      // Security: Isolate guest checkout into dedicated guest user records.
      // NEVER attach a guest order to an existing registered user account without credentials.
      const nameParts = (address.fullName || 'Guest Customer').trim().split(' ');
      const firstName = nameParts[0] || 'Guest';
      const lastName = nameParts.slice(1).join(' ') || 'Customer';
      const guestInternalEmail = `guest_${Date.now()}_${crypto.randomBytes(4).toString('hex')}@guest.rarenuts.internal`;

      const guestUser = await this.prisma.user.create({
        data: {
          email: guestInternalEmail,
          firstName,
          lastName,
          role: 'customer',
        },
      });
      effectiveUserId = guestUser.id;
    }

    if (!cart) {
      throw new NotFoundException({ code: 'CART_NOT_FOUND', message: 'Cart not found.' });
    }

    if (cart.userId && cart.userId !== userId) {
      throw new ForbiddenException({ code: 'CART_ACCESS_DENIED', message: 'You do not have access to this cart.' });
    }

    if (cart.status !== 'active') {
      throw new BadRequestException({ code: 'CART_NOT_ACTIVE', message: 'Cart is no longer active.' });
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException({ code: 'EMPTY_CART', message: 'Cannot create an order from an empty cart.' });
    }

    // ── Phase 2: Transactional order creation ────────────────────────────────
    const createdOrderResult = await this.prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);
      const orderItems: any[] = [];
      const inventoryLogs: any[] = [];

      // ── Phase 2: Batch product locking with deterministic ordering (deadlock-free) ──
      const rawProductIds = Array.from(new Set(cart.items.map((i) => i.productId)));
      const sortedProductIds = rawProductIds.sort();

      let productMap = new Map<string, any>();
      try {
        const rows = await tx.$queryRaw<any[]>(
          Prisma.sql`SELECT id, name, sku, price, "sale_price", "stock_qty", "thumbnail_url"
                     FROM "products"
                     WHERE id IN (${Prisma.join(sortedProductIds.map((id) => Prisma.sql`${id}::uuid`))})
                     ORDER BY id FOR UPDATE`,
        );
        if (rows && rows.length > 0) {
          for (const r of rows) {
            productMap.set(r.id, r);
          }
        }
      } catch {
        // Safe fallback to standard Prisma findMany if dialect issue
        const fallbackProducts = await tx.product.findMany({
          where: { id: { in: sortedProductIds } },
        });
        for (const p of fallbackProducts) {
          productMap.set(p.id, p);
        }
      }

      for (const item of cart.items) {
        const prod = productMap.get(item.productId);
        if (!prod) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        const stockQty = prod.stockQty ?? prod.stock_qty;
        if (stockQty < item.quantity) {
          throw new ConflictException({
            code: 'INSUFFICIENT_STOCK',
            message: `Insufficient stock for ${prod.name}`,
          });
        }

        const salePrice = prod.salePrice ?? prod.sale_price;
        const { price } = prod;
        const finalPrice = salePrice !== null && salePrice !== undefined ? salePrice : price;

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

        inventoryLogs.push({
          productId: prod.id,
          changeQty: -item.quantity,
          reason: 'order_placed',
        });
      }

      // Concurrently execute all stock decrements within the transaction
      await Promise.all(
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { decrement: item.quantity } },
          }),
        ),
      );

      // Coupon validation
      let discount = new Prisma.Decimal(0);
      if (couponId) {
        let coupon: any = null;
        try {
          const couponRows = await tx.$queryRaw<any[]>(
            Prisma.sql`SELECT * FROM "coupons" WHERE id = ${couponId}::uuid FOR UPDATE`,
          );
          coupon = couponRows?.[0];
        } catch {
          coupon = await tx.coupon.findUnique({ where: { id: couponId } });
        }

        if (!coupon || !coupon.status) {
          throw new BadRequestException('Coupon is invalid or no longer active');
        }

        const now = new Date();
        const startDate = new Date(coupon.startDate ?? coupon.start_date);
        const endDate = new Date(coupon.endDate ?? coupon.end_date);
        if (now < startDate || now > endDate) {
          throw new BadRequestException('Coupon is expired or not active yet');
        }
          const minOrder = coupon.minimumOrder ?? coupon.minimum_order;
          if (minOrder && subtotal.lessThan(minOrder)) {
            throw new BadRequestException(`Minimum order of ${minOrder} required for this coupon`);
          }
          const usageLimit = coupon.usageLimit ?? coupon.usage_limit;
          if (usageLimit) {
            const usageCount = await tx.order.count({ where: { couponId: coupon.id } });
            if (usageCount >= usageLimit) {
              throw new BadRequestException('Coupon usage limit reached');
            }
          }

          // Per-user abuse prevention inside transaction
          if (userId) {
            const userUsage = await tx.order.count({
              where: { couponId: coupon.id, userId },
            });
            if (userUsage > 0) {
              throw new BadRequestException('You have already used this coupon');
            }
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

      const shipping = new Prisma.Decimal('0.00');
      const tax = subtotal.mul(new Prisma.Decimal('0.05'));
      let total = subtotal.add(shipping).add(tax).sub(discount);
      if (total.lessThan(0)) total = new Prisma.Decimal(0);

      // Create address snapshot
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

      // Create order — use cryptographically random 8-char hex suffix to prevent
      // collision across workers/simultaneous transactions at 10K concurrency.
      // The `@unique` DB constraint provides a final safety net against any collision.
      const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      let createdOrder: any;
      try {
        createdOrder = await tx.order.create({
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
          include: { items: true, address: true },
        });
      } catch (err: any) {
        // P2002 = unique constraint violation — orderNumber collision (extremely rare at this entropy)
        if (err?.code === 'P2002' && err?.meta?.target?.includes('order_number')) {
          throw new ConflictException({ code: 'ORDER_NUMBER_COLLISION', message: 'Order creation collision, please retry.' });
        }
        throw err;
      }

      // Mark cart as ordered
      await tx.cart.update({ where: { id: cartId }, data: { status: 'ordered' } });

      // Write inventory logs safely
      try {
        await tx.inventoryLog.createMany({
          data: inventoryLogs.map((log) => ({ ...log, referenceId: createdOrder.id })),
        });
      } catch (logErr) {
        // Safe fallback if inventoryLog table is unmigrated
      }

      // Write outbox event safely for async worker processing
      try {
        await (tx as any).outboxEvent.create({
          data: {
            eventType: 'order_created',
            payload: {
              orderId: createdOrder.id,
              orderNumber: createdOrder.orderNumber,
              userId: effectiveUserId,
              total: createdOrder.total.toString(),
              guestEmail,
            },
          },
        });
      } catch (outboxErr) {
        // Safe fallback if outboxEvent table is unmigrated
      }

      return createdOrder;
    }, { maxWait: 15000, timeout: 30000 });

    this.invalidateUserOrders(effectiveUserId);
    return createdOrderResult;
  }

  async initializePayment(orderId: string, amount: number) {
    try {
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
      include: { items: { include: { product: true } }, address: true, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('You do not have permission to cancel this order');

    // CRITICAL: Never allow cancellation of a paid order through this path.
    // Paid orders require a dedicated refund flow (not implemented here).
    if (order.paymentStatus === 'paid') {
      throw new BadRequestException(
        'Cannot cancel a paid order. Please contact support to initiate a refund.',
      );
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      throw new BadRequestException(`Cannot cancel an order with status ${order.orderStatus}`);
    }

    // INVENTORY RESTORATION GUARD:
    // Only restore inventory if payment has NOT already been marked failed.
    // markPaymentFailed() already restores inventory atomically.
    // Double-restoration would inflate stock incorrectly.
    const shouldRestoreInventory = order.paymentStatus !== 'failed';

    const result = await this.prisma.$transaction(async (tx) => {
      const ops: Promise<any>[] = [
        tx.order.update({
          where: { id: orderId },
          data: {
            orderStatus: 'cancelled',
            paymentStatus: 'cancelled', // Explicitly mark payment cancelled for display
          },
        }),
      ];

      if (shouldRestoreInventory && order.items.length > 0) {
        // Restore stock
        ops.push(
          ...order.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { stockQty: { increment: item.quantity } },
            })
          ),
        );
        // Log inventory restoration
        ops.push(
          tx.inventoryLog.createMany({
            data: order.items.map((item) => ({
              productId: item.productId,
              changeQty: item.quantity,
              reason: 'order_cancelled',
              referenceId: orderId,
            })),
          }),
        );
      }

      const [cancelledOrder] = await Promise.all(ops);
      return cancelledOrder;
    });

    // Send notification
    await this.notifications.create(
      order.userId,
      'order_cancelled',
      'Order Cancelled',
      `Your order #${order.orderNumber} has been successfully cancelled.`
    );

    this.invalidateUserOrders(order.userId);
    return result;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async getAllOrders(query: any): Promise<{ data: Order[]; total: number }> {
    const { status, paymentStatus, page = 1, limit = 20 } = query;
    const where: any = {};
    if (status) where.orderStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

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

    return { data, total };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto, adminId?: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

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
}
