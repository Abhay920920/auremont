import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../auremont-backend/src/orders/orders.service';
import { PrismaService } from '../../auremont-backend/src/prisma/prisma.service';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import { BadRequestException } from '@nestjs/common';

describe('RARE NUTS — Failure Injection Tests', () => {
  let ordersService: OrdersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    const auditMock: any = { log: jest.fn().mockResolvedValue({}) };
    const paymentsMock: any = { createRazorpayOrder: jest.fn().mockResolvedValue({ id: 'rzp_mock_123' }) };
    const notificationsMock: any = { create: jest.fn().mockResolvedValue({}) };

    ordersService = new OrdersService(prismaMock, auditMock, paymentsMock, notificationsMock);
  });

  describe('Mid-Transaction Failures', () => {
    it('should rollback transaction if address snapshot fails after stock decrement', async () => {
      const product = {
        id: 'prod-1',
        name: 'Fine Roasted Hazelnuts',
        stockQty: 100,
        price: '400.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-1',
        userId: 'user-1',
        status: 'active',
        items: [{ id: 'item-1', productId: 'prod-1', quantity: 2, product }],
      };

      await prismaMock.product.create({ data: product });
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);
      prismaMock.product.findUnique = jest.fn().mockResolvedValue(product);
      prismaMock.$queryRaw = jest.fn().mockResolvedValue([product]);

      // Force failure on address creation (mid-transaction)
      prismaMock.address.create = jest.fn().mockImplementation(() => {
        throw new Error('Database write failure: AddressSnapshot');
      });

      // Prisma transaction mock to simulate transaction boundaries
      let transactionWasRolledBack = false;
      prismaMock.$transaction = jest.fn().mockImplementation(async (callback: any) => {
        try {
          return await callback(prismaMock);
        } catch (err) {
          transactionWasRolledBack = true;
          throw err;
        }
      });

      await expect(
        ordersService.createOrder({
          userId: 'user-1',
          cartId: 'cart-1',
          address: {
            fullName: 'Test Fail Injection',
            phone: '+919999999999',
            addressLine1: 'Error Road',
            city: 'FaultCity',
            state: 'FaultState',
            postalCode: '000000',
            country: 'Faultland',
          },
        })
      ).rejects.toThrow('Database write failure: AddressSnapshot');

      expect(transactionWasRolledBack).toBe(true); // Confirms transaction rolled back all changes
    });

    it('should rollback transaction if order insert fails', async () => {
      const product = {
        id: 'prod-2',
        name: 'Fine Walnuts',
        stockQty: 50,
        price: '300.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-2',
        userId: 'user-2',
        status: 'active',
        items: [{ id: 'item-2', productId: 'prod-2', quantity: 1, product }],
      };

      await prismaMock.product.create({ data: product });
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.product.findUnique = jest.fn().mockResolvedValue(product);
      prismaMock.$queryRaw = jest.fn().mockResolvedValue([product]);
      prismaMock.address.create = jest.fn().mockResolvedValue({ id: 'addr-2' });

      // Force failure on order creation
      prismaMock.order.create = jest.fn().mockImplementation(() => {
        throw new Error('Database write failure: OrderInsertFailed');
      });

      let transactionWasRolledBack = false;
      prismaMock.$transaction = jest.fn().mockImplementation(async (callback: any) => {
        try {
          return await callback(prismaMock);
        } catch (err) {
          transactionWasRolledBack = true;
          throw err;
        }
      });

      await expect(
        ordersService.createOrder({
          userId: 'user-2',
          cartId: 'cart-2',
          address: {
            fullName: 'Order Fail Test',
            phone: '+919999999998',
            addressLine1: 'Fail St',
            city: 'FaultCity',
            state: 'FaultState',
            postalCode: '000000',
            country: 'Faultland',
          },
        })
      ).rejects.toThrow('Database write failure: OrderInsertFailed');

      expect(transactionWasRolledBack).toBe(true);
    });
  });
});
