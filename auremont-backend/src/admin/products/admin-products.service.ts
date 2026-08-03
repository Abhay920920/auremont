import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: any, adminId: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data });
      
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: 'CREATE_PRODUCT',
          entity: 'Product',
          entityId: product.id,
          newValue: data,
        },
      });

      return product;
    });
  }
}
