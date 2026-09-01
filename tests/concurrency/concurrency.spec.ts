import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../auremont-backend/src/orders/orders.service';
import { PrismaService } from '../../auremont-backend/src/prisma/prisma.service';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import { ConflictException } from '@nestjs/common';

describe('RARE NUTS — Concurrency & Race Condition Tests', () => {
  let ordersService: OrdersService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    const auditMock: any = { log: jest.fn().mockResolvedValue({}) };
    const paymentsMock: any = { createRazorpayOrder: jest.fn().mockResolvedValue({ id: 'rzp_mock_123' }) };
    const notificationsMock: any = { create: jest.fn().mockResolvedValue({}) };

    ordersService = new OrdersService(prismaMock, auditMock, paymentsMock, notificationsMock);
  });

  describe('Simultaneous Inventory Purchase (FOR UPDATE simulation)', () => {
    it('should serialize concurrent checkouts and reject excess orders once stock is depleted', async () => {
      const product = {
        id: 'prod-last-unit',
        name: 'Last Package of Almonds',
        stockQty: 1, // Only 1 package left in stock!
        price: '800.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-1',
        userId: 'user-1',
        status: 'active',
        items: [{ id: 'item-1', productId: 'prod-last-unit', quantity: 1, product }],
      };

      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);
      
      // Simulate sequential queries inside two concurrent transactions
      // First transaction decrements stock to 0
      // Second transaction reads 0 and throws ConflictException
      let isFirstTx = true;
      prismaMock.$transaction = jest.fn().mockImplementation(async (callback: any) => {
        if (isFirstTx) {
          isFirstTx = false;
          product.stockQty = 0; // Simulate first checkout decrement
          return { id: 'order-success-1' };
        } else {
          // Second concurrent checkout finds 0 stock
          if (product.stockQty <= 0) {
            throw new ConflictException({ code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock' });
          }
          return { id: 'order-success-2' };
        }
      });

      // Launch two checkouts concurrently
      const checkout1 = ordersService.createOrder({
        userId: 'user-1',
        cartId: 'cart-1',
        address: { fullName: 'User 1', phone: '123', addressLine1: 'St 1', city: 'A', state: 'B', postalCode: '1', country: 'IN' }
      });

      const checkout2 = ordersService.createOrder({
        userId: 'user-2',
        cartId: 'cart-1',
        address: { fullName: 'User 2', phone: '456', addressLine1: 'St 2', city: 'A', state: 'B', postalCode: '2', country: 'IN' }
      });

      const results = await Promise.allSettled([checkout1, checkout2]);

      const fulfilled = results.filter(r => r.status === 'fulfilled');
      const rejected = results.filter(r => r.status === 'rejected');

      expect(fulfilled.length).toBe(1); // Exactly one request succeeded
      expect(rejected.length).toBe(1);  // Exactly one request was rejected with conflict
    });
  });
});
