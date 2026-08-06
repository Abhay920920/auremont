import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CouponsService Unit Tests', () => {
  let couponsService: CouponsService;
  let prismaMock: any;
  let auditMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    auditMock = { log: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AuditService, useValue: auditMock },
      ],
    }).compile();

    couponsService = module.get<CouponsService>(CouponsService);
  });

  describe('validateCoupon', () => {
    it('should throw BadRequestException if coupon code does not exist', async () => {
      await expect(couponsService.validateCoupon('INVALID_CODE', 1000)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if coupon is expired', async () => {
      const expiredCoupon = {
        id: 'c-expired',
        code: 'EXPIRED20',
        status: true,
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-12-31'),
        minimumOrder: null,
        usageLimit: null,
      };
      prismaMock._seed('coupons', [expiredCoupon]);

      await expect(couponsService.validateCoupon('EXPIRED20', 1000)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if subtotal is less than minimum order requirement', async () => {
      const activeCoupon = {
        id: 'c-active',
        code: 'LUXURY500',
        status: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        minimumOrder: 2000,
        usageLimit: null,
      };
      prismaMock._seed('coupons', [activeCoupon]);

      await expect(couponsService.validateCoupon('LUXURY500', 1500)).rejects.toThrow(BadRequestException);
    });

    it('should return coupon object when valid and subtotal condition is satisfied', async () => {
      const activeCoupon = {
        id: 'c-valid',
        code: 'LUXURY20',
        type: 'percentage',
        value: 20,
        status: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        minimumOrder: 1000,
        usageLimit: null,
      };
      prismaMock._seed('coupons', [activeCoupon]);

      const result = await couponsService.validateCoupon('LUXURY20', 1500);
      expect(result).toBeDefined();
      expect(result.code).toBe('LUXURY20');
    });

    it('should throw BadRequestException if coupon is inactive', async () => {
      const inactiveCoupon = {
        id: 'c-inactive',
        code: 'INACTIVE10',
        status: false,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        minimumOrder: null,
        usageLimit: null,
      };
      prismaMock._seed('coupons', [inactiveCoupon]);

      await expect(couponsService.validateCoupon('INACTIVE10', 1000)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCoupon', () => {
    it('should create a coupon and log the audit event', async () => {
      const dto = {
        code: 'NEWCOUPON',
        type: 'flat' as const,
        value: 100,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: true,
      };

      const result = await couponsService.createCoupon(dto as any, 'admin-001');
      expect(result.code).toBe('NEWCOUPON');
      expect(auditMock.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_COUPON', entity: 'Coupon' })
      );
    });
  });
});
