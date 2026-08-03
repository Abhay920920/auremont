import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayOrders,
      monthOrders,
      pendingOrders,
      totalCustomers,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      this.prisma.order.count({ where: { orderStatus: 'placed' } }),
      this.prisma.user.count(),
      this.prisma.product.count({ where: { stockQty: { lt: 10 } } }), // Assumes 10 is low stock
    ]);

    // Aggregate today's sales
    const todaySalesData = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: today }, paymentStatus: 'paid' },
    });

    // Aggregate monthly sales
    const monthlySalesData = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: firstDayOfMonth }, paymentStatus: 'paid' },
    });

    return {
      todaySales: todaySalesData._sum.total || 0,
      monthlySales: monthlySalesData._sum.total || 0,
      todayOrders,
      monthOrders,
      pendingOrders,
      totalCustomers,
      lowStockProducts,
    };
  }
}
