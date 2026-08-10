import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService Unit Tests', () => {
  let service: ProductsService;
  let prisma: any;

  const mockProduct = {
    id: 'prod-uuid-1234',
    name: 'California Reserve Raw Almonds 250g',
    slug: 'california-reserve-raw',
    sku: 'RN-RAW-250',
    price: '999.00',
    salePrice: '799.00',
    stockQty: 50,
    status: true,
    category: { id: 'cat-1', name: 'Raw Almonds', slug: 'raw-almonds' },
    images: [{ imageUrl: '/images/california-almonds-250g.png', isPrimary: true }],
  };

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  const mockAuditService = {
    logAction: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns paginated products and metadata with applied price filters', async () => {
      mockPrismaService.product.count.mockResolvedValue(1);
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll({ minPrice: 500, maxPrice: 1000, page: 1, limit: 10 });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].slug).toBe('california-reserve-raw');
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
          where: expect.objectContaining({
            price: { gte: 500, lte: 1000 },
          }),
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('finds product by UUID or slug without throwing errors', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.findBySlug('california-reserve-raw');

      expect(result.name).toBe('California Reserve Raw Almonds 250g');
      expect(mockPrismaService.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'california-reserve-raw' },
        }),
      );
    });

    it('throws NotFoundException if product does not exist', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(NotFoundException);
    });
  });
});
