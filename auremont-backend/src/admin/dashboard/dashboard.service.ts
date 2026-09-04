import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  private cachedMetrics: { data: any; expiresAt: number } | null = null;
  private inFlightMetrics: Promise<any> | null = null;
  private readonly CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

  constructor(private prisma: PrismaService) {}

  clearCache() {
    this.cachedMetrics = null;
    this.inFlightMetrics = null;
  }

  async getMetrics() {
    const now = Date.now();
    if (this.cachedMetrics && now < this.cachedMetrics.expiresAt) {
      return this.cachedMetrics.data;
    }

    if (this.inFlightMetrics) {
      return this.inFlightMetrics;
    }

    this.inFlightMetrics = (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Execute ALL 7 queries simultaneously in a single round
      const [
        todayOrders,
        monthOrders,
        pendingOrders,
        totalCustomers,
        lowStockProducts,
        todaySalesData,
        monthlySalesData,
      ] = await Promise.all([
        this.prisma.order.count({ where: { createdAt: { gte: today } } }),
        this.prisma.order.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
        this.prisma.order.count({ where: { orderStatus: 'placed' } }),
        this.prisma.user.count(),
        this.prisma.product.count({ where: { stockQty: { lt: 10 } } }),
        this.prisma.order.aggregate({
          _sum: { total: true },
          where: { createdAt: { gte: today }, paymentStatus: 'paid' },
        }),
        this.prisma.order.aggregate({
          _sum: { total: true },
          where: { createdAt: { gte: firstDayOfMonth }, paymentStatus: 'paid' },
        }),
      ]);

      const result = {
        todaySales: Number(todaySalesData._sum.total || 0),
        monthlySales: Number(monthlySalesData._sum.total || 0),
        todayOrders,
        monthOrders,
        pendingOrders,
        totalCustomers,
        lowStockProducts,
      };

      this.cachedMetrics = {
        data: result,
        expiresAt: Date.now() + this.CACHE_TTL_MS,
      };

      return result;
    })().finally(() => {
      this.inFlightMetrics = null;
    });

    return this.inFlightMetrics;
  }
}
