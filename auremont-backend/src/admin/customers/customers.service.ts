import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = { role: 'customer' };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { orders: { where: { paymentStatus: 'paid' } } },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Calculate basic LTV for the list view (optional optimization: cache this or run aggregation)
    // For simplicity, we just return the counts
    const data = users.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      status: u.status,
      createdAt: u.createdAt,
      totalOrders: u._count.orders,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, role: 'customer' },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10, // recent orders
          include: {
            payment: { select: { status: true } },
          }
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Calculate LTV and AOV from all paid orders
    const allPaidOrders = await this.prisma.order.findMany({
      where: { userId: id, paymentStatus: 'paid' },
      select: { total: true },
    });

    const totalOrders = allPaidOrders.length;
    const lifetimeValue = allPaidOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? lifetimeValue / totalOrders : 0;

    return {
      ...user,
      metrics: {
        totalOrders,
        lifetimeValue,
        averageOrderValue,
      }
    };
  }

  async updateStatus(id: string, status: UserStatus, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id, role: 'customer' } });
    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    await this.prisma.adminAuditLog.create({
      data: {
        adminId,
        action: 'UPDATE_CUSTOMER_STATUS',
        entity: 'USER',
        entityId: id,
        oldValue: { status: user.status },
        newValue: { status },
      },
    });

    return updated;
  }
}
