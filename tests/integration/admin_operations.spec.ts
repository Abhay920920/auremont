import { Test, TestingModule } from '@nestjs/testing';
import { AdminCustomersService } from '../../auremont-backend/src/admin/customers/customers.service';
import { AdminReviewsService } from '../../auremont-backend/src/admin/reviews/reviews.service';
import { AdminProductsService } from '../../auremont-backend/src/admin/products/admin-products.service';
import { PrismaService } from '../../auremont-backend/src/prisma/prisma.service';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('Admin Operations & Audit Logging Integration Tests', () => {
  let customersService: AdminCustomersService;
  let reviewsService: AdminReviewsService;
  let productsService: AdminProductsService;
  let prismaMock: any;

  const testAdmin = {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@rarenuts.com',
    firstName: 'Admin',
    lastName: 'Concierge',
    role: 'admin',
  };

  const testCustomer = {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'client@example.com',
    firstName: 'Eleanor',
    lastName: 'Vance',
    role: 'customer',
    status: 'active',
  };

  const testProduct = {
    id: 'p0000000-0000-0000-0000-000000000001',
    name: 'Single Origin California Almonds',
    slug: 'single-origin-california-almonds',
    sku: 'ALM-SOCA-250',
    price: '950.00',
    stockQty: 50,
  };

  const testReview = {
    id: 'r0000000-0000-0000-0000-000000000001',
    productId: testProduct.id,
    userId: testCustomer.id,
    rating: 5,
    title: 'Exquisite Quality',
    review: 'Truly the finest roasted almonds I have tasted.',
    status: 'pending',
  };

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    prismaMock._seed('users', [testAdmin, testCustomer]);
    prismaMock._seed('products', [testProduct]);
    prismaMock._seed('reviews', [testReview]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCustomersService,
        AdminReviewsService,
        AdminProductsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    customersService = module.get<AdminCustomersService>(AdminCustomersService);
    reviewsService = module.get<AdminReviewsService>(AdminReviewsService);
    productsService = module.get<AdminProductsService>(AdminProductsService);
  });

  describe('Customer Status Update & Audit Log', () => {
    it('should update customer status and record a valid AdminAuditLog record', async () => {
      const updated = await customersService.updateStatus(
        testCustomer.id,
        'blocked' as any,
        testAdmin.id,
      );

      expect(updated.status).toBe('blocked');

      const auditLogs = prismaMock._getDb().adminAuditLogs;
      expect(auditLogs.length).toBe(1);
      expect(auditLogs[0].adminId).toBe(testAdmin.id);
      expect(auditLogs[0].action).toBe('UPDATE_CUSTOMER_STATUS');
      expect(auditLogs[0].entityId).toBe(testCustomer.id);
      expect(auditLogs[0].newValue).toEqual({ status: 'blocked' });
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      await expect(
        customersService.updateStatus('00000000-0000-0000-0000-999999999999', 'inactive' as any, testAdmin.id),
      ).rejects.toThrow(/not found/i);
    });
  });

  describe('Review Moderation & Audit Log', () => {
    it('should transition review from pending to approved and log administrative audit', async () => {
      const updated = await reviewsService.updateStatus(
        testReview.id,
        'approved' as any,
        testAdmin.id,
      );

      expect(updated.status).toBe('approved');

      const auditLogs = prismaMock._getDb().adminAuditLogs;
      expect(auditLogs.length).toBe(1);
      expect(auditLogs[0].adminId).toBe(testAdmin.id);
      expect(auditLogs[0].action).toBe('UPDATE_REVIEW_STATUS');
      expect(auditLogs[0].entityId).toBe(testReview.id);
    });

    it('should throw NotFoundException if review does not exist', async () => {
      await expect(
        reviewsService.updateStatus('00000000-0000-0000-0000-999999999999', 'approved' as any, testAdmin.id),
      ).rejects.toThrow(/not found/i);
    });
  });

  describe('Admin Product Creation & Audit Log', () => {
    it('should create product in transaction and record creation in AdminAuditLog', async () => {
      const newProductData = {
        name: 'Truffle Glazed Almonds 500g',
        slug: 'truffle-glazed-almonds-500g',
        sku: 'ALM-TRUF-500',
        weightGrams: 500,
        price: '1800.00',
        stockQty: 30,
      };

      const created = await productsService.create(newProductData, testAdmin.id);
      expect(created.name).toBe('Truffle Glazed Almonds 500g');

      const auditLogs = prismaMock._getDb().adminAuditLogs;
      expect(auditLogs.length).toBe(1);
      expect(auditLogs[0].adminId).toBe(testAdmin.id);
      expect(auditLogs[0].action).toBe('CREATE_PRODUCT');
      expect(auditLogs[0].entity).toBe('Product');
      expect(auditLogs[0].entityId).toBe(created.id);
    });
  });
});
