import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PayStatus } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: OrderStatus) {
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

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    const updated = await this.prisma.order.update({
      where: { id },
      data: { orderStatus: status },
    });

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
