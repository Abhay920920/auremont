/* eslint-disable no-await-in-loop */
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

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
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

    // Idempotency check
    if (idempotencyKey) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: { include: { product: true } }, address: true },
      });
      if (existingOrder) {
        return existingOrder;
      }
    }

    // Resolve or create user ID for guest orders
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const email = guestEmail || `guest_${Date.now()}@auremont.com`;
      let guestUser = await this.prisma.user.findUnique({ where: { email } });
      if (!guestUser) {
        const nameParts = (address.fullName || 'Guest Customer').trim().split(' ');
        const firstName = nameParts[0] || 'Guest';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';
        guestUser = await this.prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            role: 'customer',
          },
        });
      }
      effectiveUserId = guestUser.id;
    }

    // ── Phase 1: Lightweight pre-flight validation (no transaction) ──────────
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException({ code: 'CART_NOT_FOUND', message: 'Cart not found.' });
    }

    if (cart.userId && userId && cart.userId !== userId) {
      throw new ForbiddenException({ code: 'CART_ACCESS_DENIED', message: 'You do not have access to this cart.' });
    }

    if (cart.status !== 'active') {
      throw new BadRequestException({ code: 'CART_NOT_ACTIVE', message: 'Cart is no longer active.' });
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException({ code: 'EMPTY_CART', message: 'Cannot create an order from an empty cart.' });
    }

    // ── Phase 2: Transactional order creation ────────────────────────────────
    return await this.prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);
      const orderItems: any[] = [];
      const inventoryLogs: any[] = [];

      // eslint-disable-next-line no-await-in-loop
      for (const item of cart.items) {
        // Lock product row with FOR UPDATE to prevent race conditions
        const rows = await tx.$queryRaw<any[]>(
          Prisma.sql`SELECT * FROM "products" WHERE id = ${item.productId}::uuid FOR UPDATE`,
        );

        const [prod] = rows;
        if (!prod) {
          throw new NotFoundException(`Product ${item.product.name} not found`);
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

        await tx.product.update({
          where: { id: prod.id },
          data: { stockQty: { decrement: item.quantity } },
        });

        inventoryLogs.push({
          productId: prod.id,
          changeQty: -item.quantity,
          reason: 'order_placed',
        });
      }

      // Coupon validation
      let discount = new Prisma.Decimal(0);
      if (couponId) {
        const coupon = await tx.coupon.findUnique({ where: { id: couponId } });
        if (coupon && coupon.status) {
          const now = new Date();
          if (now < coupon.startDate || now > coupon.endDate) {
            throw new BadRequestException('Coupon is expired or not active yet');
          }
          if (coupon.minimumOrder && subtotal.lessThan(coupon.minimumOrder)) {
            throw new BadRequestException(`Minimum order of ${coupon.minimumOrder} required for this coupon`);
          }
          if (coupon.usageLimit) {
            const usageCount = await tx.order.count({ where: { couponId: coupon.id } });
            if (usageCount >= coupon.usageLimit) {
              throw new BadRequestException('Coupon usage limit reached');
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
      }

      const shipping = new Prisma.Decimal('10.00');
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

      // Create order
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const createdOrder = await tx.order.create({
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

      // Mark cart as ordered
      await tx.cart.update({ where: { id: cartId }, data: { status: 'ordered' } });

      // Write inventory logs
      await tx.inventoryLog.createMany({
        data: inventoryLogs.map((log) => ({ ...log, referenceId: createdOrder.id })),
      });

      return createdOrder;
    }, { maxWait: 5000, timeout: 10000 });
  }

  async initializePayment(orderId: string, amount: number) {
    try {
      return await this.payments.createRazorpayOrder(orderId, amount);
    } catch (err) {
      // Log but don't fail the checkout — order is already created
      console.error('Payment initialization failed:', err.message);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, address: true },
    });
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
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      throw new BadRequestException(`Cannot cancel an order with status ${order.orderStatus}`);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { orderStatus: 'cancelled' },
      });

      // eslint-disable-next-line no-await-in-loop
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { increment: item.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            changeQty: item.quantity,
            reason: 'order_cancelled',
            referenceId: orderId,
          },
        });
      }

      return cancelledOrder;
    });

    // Send notification
    await this.notifications.create(
      order.userId,
      'order_cancelled',
      'Order Cancelled',
      `Your order #${order.orderNumber} has been successfully cancelled.`
    );

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
