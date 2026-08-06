/* jscpd:ignore-start */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../src/orders/orders.service';
import { CartService } from '../src/cart/cart.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuditService } from '../src/audit/audit.service';
import { PaymentsService } from '../src/payments/payments.service';
import { NotificationsService } from '../src/notifications/notifications.service';
import { createMockPrismaService } from '../src/prisma/prisma.service.mock';
import { ConflictException, ForbiddenException } from '@nestjs/common';

describe('Security & Inventory Concurrency Test Suite', () => {
  let cartService: CartService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
  });

  describe('IDOR & Broken Access Control Tests', () => {
    it('User A should be forbidden from modifying User B cart items', async () => {
      const userBCart = { id: 'cart-user-B', userId: 'user-B', status: 'active' };
      const itemB = {
        id: 'item-B',
        cartId: 'cart-user-B',
        productId: 'prod-1',
        quantity: 1,
        unitPrice: '100.00',
        cart: userBCart,
      };

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(itemB);

      await expect(cartService.updateItemQuantity('item-B', 10, 'user-A')).rejects.toThrow(ForbiddenException);
    });

    it('User A should be forbidden from deleting User B cart items', async () => {
      const userBCart = { id: 'cart-user-B', userId: 'user-B', status: 'active' };
      const itemB = {
        id: 'item-B',
        cartId: 'cart-user-B',
        productId: 'prod-1',
        quantity: 1,
        unitPrice: '100.00',
        cart: userBCart,
      };

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue(itemB);

      await expect(cartService.removeItem('item-B', 'user-A')).rejects.toThrow(ForbiddenException);
    });

    it('User A should not see User B cart when using their userId', async () => {
      const userBCart = { id: 'cart-user-B', userId: 'user-B', status: 'active', items: [] };

      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(userBCart);

      // user-A requests cart by ID that belongs to user-B
      await expect(cartService.getCart('cart-user-B', 'user-A')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Inventory Stock Guard Tests', () => {
    it('should reject order when product stockQty is 0', async () => {
      const auditMock = { log: jest.fn() };
      const paymentsMock = { createRazorpayOrder: jest.fn() };
      const notificationsMock = { create: jest.fn() };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrdersService,
          { provide: PrismaService, useValue: prismaMock },
          { provide: AuditService, useValue: auditMock },
          { provide: PaymentsService, useValue: paymentsMock },
          { provide: NotificationsService, useValue: notificationsMock },
        ],
      }).compile();

      const ordersService = module.get<OrdersService>(OrdersService);

      const product = {
        id: 'prod-out-of-stock',
        name: 'Out of Stock Almonds',
        stockQty: 0,
        price: '999.00',
        salePrice: null,
      };

      const cart = {
        id: 'cart-user-A',
        userId: 'user-A',
        status: 'active',
        items: [{ id: 'item-A', productId: 'prod-out-of-stock', quantity: 1, product }],
      };

      prismaMock._seed('products', [product]);
      // Override to return cart with embedded product data
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue(cart);
      prismaMock.cart.findFirst = jest.fn().mockResolvedValue(cart);

      await expect(
        ordersService.createOrder({
          userId: 'user-A',
          cartId: 'cart-user-A',
          address: {
            fullName: 'Test Customer',
            phone: '+919876543210',
            addressLine1: 'Street 1',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'India',
          },
        })
      ).rejects.toThrow(ConflictException);
    });
  });
});
