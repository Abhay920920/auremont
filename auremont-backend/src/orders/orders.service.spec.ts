/* jscpd:ignore-start */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { ConflictException, ForbiddenException } from '@nestjs/common';

describe('OrdersService Unit Tests & Transaction Safety', () => {
  let ordersService: OrdersService;
  let prismaMock: any;
  let auditMock: any;
  let paymentsMock: any;
  let notificationsMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    auditMock = { log: jest.fn().mockResolvedValue(true) };
    paymentsMock = { createRazorpayOrder: jest.fn().mockResolvedValue({ id: 'rzp_order_123' }) };
    notificationsMock = { create: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AuditService, useValue: auditMock },
        { provide: PaymentsService, useValue: paymentsMock },
        { provide: NotificationsService, useValue: notificationsMock },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should return existing order when idempotencyKey matches (Idempotency Rule)', async () => {
      const existingOrder = {
        id: 'ord-existing-id',
        idempotencyKey: 'idempotency-key-001',
        total: '1000.00',
        orderStatus: 'placed',
      };
      prismaMock._seed('orders', [existingOrder]);

      const result = await ordersService.createOrder({
        userId: 'user-001',
        cartId: 'cart-001',
        idempotencyKey: 'idempotency-key-001',
        address: {
          fullName: 'Alexander Vance',
          phone: '+919876543210',
          addressLine1: '123 Luxury Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
      });

      expect(result.id).toBe('ord-existing-id');
      expect(result.idempotencyKey).toBe('idempotency-key-001');
    });

    it('should throw ConflictException when stock quantity is insufficient', async () => {
      const product = {
        id: 'prod-001-uuid',
        name: 'California Almonds 250g',
        stockQty: 1, // Only 1 in stock
        price: '799.00',
        salePrice: null,
      };
      const cart = {
        id: 'cart-001-uuid',
        userId: 'user-001',
        status: 'active',
        items: [
          {
            id: 'item-1',
            productId: product.id,
            quantity: 5, // Demanding 5 units
            product,
          },
        ],
      };

      prismaMock._seed('products', [product]);
      prismaMock._seed('carts', [cart]);

      await expect(
        ordersService.createOrder({
          userId: 'user-001',
          cartId: cart.id,
          address: {
            fullName: 'Alexander Vance',
            phone: '+919876543210',
            addressLine1: '123 Luxury Ave',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
          },
        })
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully place order, deduct stock, and update cart status', async () => {
      const product = {
        id: 'prod-001-uuid',
        name: 'California Almonds 250g',
        stockQty: 20,
        price: '800.00',
        salePrice: null,
      };
      const cart = {
        id: 'cart-001-uuid',
        userId: 'user-001',
        status: 'active',
        items: [
          {
            id: 'item-1',
            productId: product.id,
            quantity: 2,
            product,
          },
        ],
      };

      prismaMock._seed('products', [product]);
      prismaMock._seed('carts', [cart]);

      const order = await ordersService.createOrder({
        userId: 'user-001',
        cartId: cart.id,
        address: {
          fullName: 'Alexander Vance',
          phone: '+919876543210',
          addressLine1: '123 Luxury Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
      });

      expect(order.id).toBeDefined();
      expect(order.orderStatus).toBe('placed');
      expect(order.paymentStatus).toBe('pending');
      
      // Verify stock was decremented from 20 -> 18
      const updatedProd = await prismaMock.product.findUnique({ where: { id: product.id } });
      expect(updatedProd.stockQty).toBe(18);

      // Verify cart status updated to 'ordered'
      const updatedCart = await prismaMock.cart.findUnique({ where: { id: cart.id } });
      expect(updatedCart.status).toBe('ordered');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order and restore product stock', async () => {
      const product = { id: 'prod-001', stockQty: 10 };
      const order = {
        id: 'order-001',
        orderNumber: 'ORD-100',
        userId: 'user-001',
        orderStatus: 'placed',
        items: [{ productId: 'prod-001', quantity: 3 }],
      };

      prismaMock._seed('products', [product]);
      prismaMock._seed('orders', [order]);

      const result = await ordersService.cancelOrder('order-001', 'user-001');
      expect(result.orderStatus).toBe('cancelled');

      // Verify stock incremented from 10 -> 13
      const updatedProd = await prismaMock.product.findUnique({ where: { id: 'prod-001' } });
      expect(updatedProd.stockQty).toBe(13);

      expect(notificationsMock.create).toHaveBeenCalledWith(
        'user-001',
        'order_cancelled',
        'Order Cancelled',
        expect.any(String)
      );
    });

    it('should throw ForbiddenException if user cancels someone else order', async () => {
      const order = { id: 'order-001', userId: 'user-owner', orderStatus: 'placed', items: [] };
      prismaMock._seed('orders', [order]);

      await expect(ordersService.cancelOrder('order-001', 'unauthorized-user')).rejects.toThrow(ForbiddenException);
    });
  });
});
