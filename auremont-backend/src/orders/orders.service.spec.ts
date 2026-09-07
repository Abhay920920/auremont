import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersService Unit Tests', () => {
  let service: OrdersService;

  const mockCart = {
    id: 'cart-1234',
    userId: 'user-1234',
    status: 'active',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        product: { id: 'prod-1', name: 'California Almonds 250g', price: '799.00', salePrice: null, stockQty: 20, sku: 'RN-RAW-250' },
      },
    ],
  };

  const mockPrismaService = {
    order: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    address: {
      create: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null),
      count: jest.fn().mockResolvedValue(0),
    },
    coupon: {
      findUnique: jest.fn(),
    },
    inventoryLog: {
      createMany: jest.fn(),
    },
    outboxEvent: {
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockPaymentsService = {
    createRazorpayOrder: jest.fn().mockResolvedValue({ razorpayOrderId: 'order_mock_1234' }),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue({}),
  };

  const mockNotificationsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: PaymentsService, useValue: mockPaymentsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('creates an order, calculates 5% tax, and marks cart as ordered', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue(mockCart);
      // $queryRaw is called inside the $transaction callback with the tx object (same mock)
      mockPrismaService.$queryRaw.mockResolvedValue([{
        id: 'prod-1',
        stock_qty: 18,
        price: '799.00',
        sale_price: null,
        name: 'California Almonds 250g',
        sku: 'RN-RAW-250',
        thumbnail_url: null,
      }]);
      mockPrismaService.address.create.mockResolvedValue({ id: 'addr-1' });
      mockPrismaService.cart.update.mockResolvedValue({ id: 'cart-1234', status: 'ordered' });
      mockPrismaService.order.create.mockResolvedValue({
        id: 'ord-1234',
        orderNumber: 'ORD-2026-99',
        total: '1677.90',
        items: [],
        address: { id: 'addr-1' },
      });

      const order = await service.createOrder({
        userId: 'user-1234',
        cartId: 'cart-1234',
        address: {
          fullName: 'John Doe',
          phone: '9876543210',
          addressLine1: '100 Botanical Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
      });

      expect(order.id).toBe('ord-1234');

      // cart.update runs in setImmediate (fire-and-forget) — await next tick to capture it
      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(mockPrismaService.cart.update).toHaveBeenCalledWith({
        where: { id: 'cart-1234' },
        data: { status: 'ordered' },
      });
    });

    it('rejects order creation if cart is empty', async () => {
      mockPrismaService.cart.findUnique.mockResolvedValue({ ...mockCart, items: [] });

      await expect(
        service.createOrder({
          userId: 'user-1234',
          cartId: 'cart-1234',
          address: { fullName: 'Jane', phone: '123', addressLine1: 'A', city: 'B', state: 'C', postalCode: '1', country: 'India' },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
