import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminOperationsService {
  constructor(private prisma: PrismaService) {}

  // Mocking Coupons since there's no DB model yet.
  private mockCoupons = [
    {
      id: '1',
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      usageLimit: 100,
      usedCount: 45,
      status: 'active',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      id: '2',
      code: 'FLAT500',
      type: 'FLAT',
      value: 500,
      usageLimit: 50,
      usedCount: 50,
      status: 'expired',
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    }
  ];

  async getCoupons() {
    return { data: this.mockCoupons };
  }

  async createCoupon(data: any) {
    const newCoupon = {
      id: Math.random().toString(36).substr(2, 9),
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      usageLimit: data.usageLimit || null,
      usedCount: 0,
      status: 'active',
      expiresAt: data.expiresAt || null,
    };
    this.mockCoupons.unshift(newCoupon);
    return newCoupon;
  }

  async getAuditLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.adminAuditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      this.prisma.adminAuditLog.count(),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}
