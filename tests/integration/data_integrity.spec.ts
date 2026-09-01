import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../auremont-backend/src/orders/orders.service';
import { PrismaService } from '../../auremont-backend/src/prisma/prisma.service';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('RARE NUTS — Data Integrity Tests', () => {
  let ordersService: OrdersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    ordersService = new OrdersService(
      prismaMock as any,
      { log: jest.fn() } as any,
      { createRazorpayOrder: jest.fn() } as any,
      { create: jest.fn() } as any,
    );
  });

  describe('Transactional Order Rollbacks', () => {
    it('should reject checkout and rollback if stockQty is less than requested quantity', async () => {
      const product = {
        id: 'prod-1',
        name: 'Artisanal Roasted Almonds',
        stockQty: 5,
        price: '500.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-1',
        userId: 'user-1',
        status: 'active',
        items: [{ id: 'item-1', productId: 'prod-1', quantity: 10, product }], // Ordering 10, stock is 5
      };

      prismaMock._seed('products', [product]);
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);

      // Prisma transaction mock to simulate row lock and check
      prismaMock.$transaction = jest.fn().mockImplementation(async (callback: any) => {
        return callback(prismaMock);
      });

      await expect(
        ordersService.createOrder({
          userId: 'user-1',
          cartId: 'cart-1',
          address: {
            fullName: 'Integrity Tester',
            phone: '+919876543210',
            addressLine1: 'Test St 1',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'India',
          },
        })
      ).rejects.toThrow(/insufficient stock/i);
    });
  });

  describe('Coupon Limit Integrity', () => {
    it('should reject order if coupon usage exceeds maximum usage limit', async () => {
      const product = {
        id: 'prod-1',
        name: 'Artisanal Roasted Almonds',
        stockQty: 20,
        price: '500.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-1',
        userId: 'user-1',
        status: 'active',
        items: [{ id: 'item-1', productId: 'prod-1', quantity: 1, product }],
      };

      const coupon = {
        id: 'coupon-1',
        code: 'MAXLIMIT',
        type: 'percentage',
        value: 10,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000),
        usageLimit: 5,
        status: true,
      };

      prismaMock._seed('products', [product]);
      prismaMock._seed('carts', [cart]);
      prismaMock._seed('coupons', [coupon]);
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);
      prismaMock.coupon.findUnique = jest.fn().mockResolvedValue(coupon);
      prismaMock.$queryRaw = jest.fn().mockImplementation((query: any) => {
        const str = JSON.stringify(query);
        if (str.includes('coupons')) return [coupon];
        return [product];
      });
      prismaMock.order.count = jest.fn().mockResolvedValue(5); // Current usage is 5 (limit reached)

      prismaMock.$transaction = jest.fn().mockImplementation(async (callback: any) => {
        return callback(prismaMock);
      });

      await expect(
        ordersService.createOrder({
          userId: 'user-1',
          cartId: 'cart-1',
          couponId: 'coupon-1',
          address: {
            fullName: 'Integrity Tester',
            phone: '+919876543210',
            addressLine1: 'Test St 1',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'India',
          },
        })
      ).rejects.toThrow(/limit reached/i);
    });
  });
});
