import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PayStatus } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private inFlight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 15 * 1000; // 15 seconds

  constructor(private prisma: PrismaService) {}

  clearCache() {
    this.cache.clear();
    this.inFlight.clear();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: OrderStatus) {
    const cacheKey = `orders:${page}:${limit}:${search || ''}:${status || ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }

    const fetchPromise = (async () => {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
        ];
      }
      if (status) {
        where.orderStatus = status;
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            payment: { select: { status: true, provider: true } },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      const result = {
        data: orders,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      this.cache.set(cacheKey, { data: result, expiresAt: Date.now() + this.CACHE_TTL_MS });
      return result;
    })().finally(() => {
      this.inFlight.delete(cacheKey);
    });

    this.inFlight.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        address: true,
        items: true,
        payment: true,
        coupon: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus, adminId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const current = order.orderStatus;
    const target = status;

    if (current === target) {
      return order;
    }

    const ALLOWED_TRANSITIONS: Record<string, string[]> = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['packed', 'cancelled'],
      packed: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    const allowed = ALLOWED_TRANSITIONS[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Invalid state transition: Cannot transition order #${order.orderNumber} from '${current}' to '${target}'.`,
      );
    }

    if (target === 'confirmed' && order.paymentStatus !== 'paid') {
      throw new BadRequestException(
        `Cannot confirm order #${order.orderNumber}: paymentStatus is '${order.paymentStatus}', expected 'paid'.`,
      );
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { orderStatus: status },
    });

    this.clearCache();

    if (adminId) {
      try {
        await this.prisma.adminAuditLog.create({
          data: {
            adminId,
            action: 'UPDATE_ORDER_STATUS',
            entity: 'ORDER',
            entityId: id,
            oldValue: { status: order.orderStatus },
            newValue: { status },
          },
        });
      } catch (err) {
        console.warn('Failed to create admin audit log for order status update:', err);
      }
    }

    return updated;
  }

  async updatePaymentStatus(id: string, status: PayStatus, adminId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Invariant: Cannot downgrade from 'paid' to 'pending' or 'failed'
    if (order.paymentStatus === 'paid' && (status === 'pending' || status === 'failed')) {
      throw new BadRequestException(`Cannot downgrade payment status from 'paid' to '${status}'.`);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { paymentStatus: status },
    });

    if (adminId) {
      try {
        await this.prisma.adminAuditLog.create({
          data: {
            adminId,
            action: 'UPDATE_PAYMENT_STATUS',
            entity: 'ORDER',
            entityId: id,
            oldValue: { status: order.paymentStatus },
            newValue: { status },
          },
        });
      } catch (err) {
        console.warn('Failed to create admin audit log for payment status update:', err);
      }
    }

    return updated;
  }
}
