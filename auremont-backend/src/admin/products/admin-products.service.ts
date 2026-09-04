import { Injectable } from '@nestjs/common';
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
    const sku = data.sku || `RN-${(data.slug || Date.now().toString()).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20)}-${Math.floor(Math.random() * 1000)}`;
    const weightGrams = typeof data.weightGrams === 'number' ? data.weightGrams : 250;
    const productPayload = { ...data, sku, weightGrams };

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: productPayload });
      
      try {
        await tx.adminAuditLog.create({
          data: {
            adminId,
            action: 'CREATE_PRODUCT',
            entity: 'Product',
            entityId: product.id,
            newValue: productPayload,
          },
        });
      } catch {
        // Non-blocking audit log creation if adminId is not a foreign key match
      }

      return product;
    });
  }
}
