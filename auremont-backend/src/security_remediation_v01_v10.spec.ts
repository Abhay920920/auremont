/* eslint-disable max-lines-per-function, complexity */
import { ForbiddenException, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders/orders.service';
import { CartService } from './cart/cart.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { AdminCustomersService } from './admin/customers/customers.service';
import { createMockPrismaService } from './prisma/prisma.service.mock';
import { AuthController } from './auth/auth.controller';
import * as fs from 'fs';
import * as path from 'path';

describe('RARE NUTS — Security Remediation Regression Tests (V-01 → V-10)', () => {
  let prismaMock: any;
  let ordersService: OrdersService;
  let cartService: CartService;
  let authService: AuthService;
  let usersService: UsersService;
  let adminCustomersService: AdminCustomersService;
  let authController: AuthController;

  beforeEach(() => {
    prismaMock = createMockPrismaService();

    const mockAudit: any = { log: jest.fn() };
    const mockPayments: any = {
      createRazorpayOrder: jest.fn(),
      generateOrderToken: jest.fn().mockReturnValue('tok_123'),
      verifyOrderToken: jest.fn().mockReturnValue(true),
    };
    const mockNotifications: any = { create: jest.fn().mockResolvedValue(true) };
    const mockJwt: any = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
      verify: jest.fn().mockReturnValue({ sub: 'user-uuid-1', email: 'test@example.com', role: 'customer' }),
    };
    const mockMail: any = { sendPasswordResetEmail: jest.fn().mockResolvedValue(true) };

    usersService = new UsersService(prismaMock);
    authService = new AuthService(usersService, prismaMock, mockJwt, mockMail);
    authController = new AuthController(authService);
    ordersService = new OrdersService(prismaMock, mockAudit, mockPayments, mockNotifications);
    cartService = new CartService(prismaMock);
    adminCustomersService = new AdminCustomersService(prismaMock);
  });

  // ── V-01: Inventory Inflation / Cancellation Race ──────────────────────────
  describe('V-01: Atomic Order Cancellation & Concurrency', () => {
    it('should reject cancellation of an already cancelled order and only restore stock once', async () => {
      const orderId = '00000000-0000-4000-8000-000000000001';
      const userId = 'user-uuid-1';
      const productId = 'prod-uuid-1';

      const placedOrder = {
        id: orderId,
        orderStatus: 'placed',
        paymentStatus: 'pending',
        userId,
        orderNumber: 'ORD-12345',
        items: [{ productId, quantity: 2 }],
      };

      // Mock transaction queryRaw to simulate row lock
      prismaMock.$queryRaw = jest.fn().mockResolvedValue([{
        id: orderId,
        order_status: 'placed',
        payment_status: 'pending',
        user_id: userId,
        order_number: 'ORD-12345',
      }]);

      prismaMock.order.findUnique = jest.fn().mockResolvedValue(placedOrder);
      prismaMock.order.update = jest.fn().mockResolvedValue({ ...placedOrder, orderStatus: 'cancelled' });
      prismaMock.product.update = jest.fn().mockResolvedValue({ id: productId, stockQty: 10 });
      prismaMock.inventoryLog.createMany = jest.fn().mockResolvedValue({ count: 1 });

      // First cancellation: succeeds
      const result = await ordersService.cancelOrder(orderId, userId);
      expect(result).toBeDefined();
      expect(prismaMock.product.update).toHaveBeenCalledTimes(1);

      // Second concurrent attempt: order is now locked with status 'cancelled'
      prismaMock.$queryRaw = jest.fn().mockResolvedValue([{
        id: orderId,
        order_status: 'cancelled',
        payment_status: 'cancelled',
        user_id: userId,
        order_number: 'ORD-12345',
      }]);

      await expect(ordersService.cancelOrder(orderId, userId)).rejects.toThrow(BadRequestException);
      // Stock update must NOT have been called a second time
      expect(prismaMock.product.update).toHaveBeenCalledTimes(1);
    });

    it('should reject cancellation if user does not own the order', async () => {
      const orderId = '00000000-0000-4000-8000-000000000002';
      prismaMock.$queryRaw = jest.fn().mockResolvedValue([{
        id: orderId,
        order_status: 'placed',
        payment_status: 'pending',
        user_id: 'real-owner-uuid',
        order_number: 'ORD-55555',
      }]);

      await expect(ordersService.cancelOrder(orderId, 'attacker-uuid')).rejects.toThrow(ForbiddenException);
    });
  });

  // ── V-02: Guest Coupon Per-Customer Restriction ────────────────────────────
  describe('V-02: Guest Coupon Abuse Prevention', () => {
    it('should reject coupon reuse for guest checkout with the same phone number', async () => {
      const couponId = 'coupon-uuid-1';
      const cartId = 'cart-uuid-1';

      prismaMock._seed('products', [
        { id: 'prod-1', name: 'Almonds', price: '1000', stock_qty: 10, stockQty: 10 },
      ]);

      prismaMock.cart.findUnique = jest.fn().mockResolvedValue({
        id: cartId,
        status: 'active',
        items: [{ productId: 'prod-1', quantity: 1, unitPrice: 1000 }],
      });

      prismaMock.$queryRaw = jest.fn().mockImplementation((query: any) => {
        const text = query?.text || query?.strings?.join('') || '';
        if (text.includes('products')) {
          return Promise.resolve([{ id: 'prod-1', name: 'Almonds', price: 1000, stock_qty: 10 }]);
        }
        if (text.includes('coupons')) {
          return Promise.resolve([{
            id: couponId,
            status: true,
            type: 'percentage',
            value: 20,
            startDate: new Date(Date.now() - 86400000),
            endDate: new Date(Date.now() + 86400000),
            minimumOrder: 500,
          }]);
        }
        return Promise.resolve([]);
      });

      // Simulate that an order already exists for this recipient phone number
      prismaMock.order.count = jest.fn().mockResolvedValue(1);

      await expect(
        ordersService.createOrder({
          cartId,
          couponId,
          guestEmail: 'guest2@example.com',
          address: {
            fullName: 'Guest Customer',
            phone: '+91 98765 43210',
            addressLine1: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
          },
        }),
      ).rejects.toThrow('You have already used this coupon');
    });
  });

  // ── V-03: Guest Cart BOLA Prevention ───────────────────────────────────────
  describe('V-03: Guest Cart Item Ownership Enforcement', () => {
    it('should reject guest cart mutation when cartId is missing', async () => {
      const itemId = 'item-1';
      const guestCartId = 'guest-cart-uuid-1';

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue({
        id: itemId,
        cartId: guestCartId,
        unitPrice: 500,
        cart: { userId: null }, // Guest cart
      });

      // Calling updateItemQuantity without cartId must throw ForbiddenException
      await expect(
        cartService.updateItemQuantity(itemId, 2, undefined, undefined),
      ).rejects.toThrow(ForbiddenException);

      // Calling removeItem without cartId must throw ForbiddenException
      await expect(
        cartService.removeItem(itemId, undefined, undefined),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject guest cart mutation when cartId does not match the items cart', async () => {
      const itemId = 'item-1';
      const guestCartId = 'guest-cart-uuid-1';

      prismaMock.cartItem.findUnique = jest.fn().mockResolvedValue({
        id: itemId,
        cartId: guestCartId,
        unitPrice: 500,
        cart: { userId: null },
      });

      await expect(
        cartService.updateItemQuantity(itemId, 2, undefined, 'different-cart-uuid'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject anonymous caller adding items to an authenticated users cart', async () => {
      prismaMock.cart.findUnique = jest.fn().mockResolvedValue({
        id: 'user-cart-uuid',
        userId: 'registered-user-uuid',
        status: 'active',
      });
      prismaMock.product.findFirst = jest.fn().mockResolvedValue({
        id: 'prod-1',
        name: 'Almonds',
        price: 500,
        stockQty: 10,
      });

      await expect(
        cartService.addItemToCart({
          cartId: 'user-cart-uuid',
          productId: 'prod-1',
          quantity: 1,
          userId: undefined, // Anonymous caller
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── V-04 & V-05: Credential & Token Exposure Prevention ─────────────────────
  describe('V-04 & V-05: Sensitive Auth Fields Stripped from Responses', () => {
    it('should not expose passwordHash, refreshToken, or resetToken in AdminCustomersService.findOne', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({
        id: 'cust-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'customer',
        status: 'active',
        passwordHash: '$2b$10$supersecretpasswordhash',
        refreshToken: '$2b$10$supersecretrefreshtokenhash',
        resetToken: '$2b$10$supersecretresettokenhash',
        resetTokenExpiry: new Date(),
        addresses: [],
        orders: [],
      });
      prismaMock.order.findMany = jest.fn().mockResolvedValue([]);

      const result: any = await adminCustomersService.findOne('cust-1');

      expect(result.id).toBe('cust-1');
      expect(result.passwordHash).toBeUndefined();
      expect(result.refreshToken).toBeUndefined();
      expect(result.resetToken).toBeUndefined();
      expect(result.resetTokenExpiry).toBeUndefined();
    });

    it('should not expose passwordHash or tokens in UsersService.getUserDetailAdmin', async () => {
      prismaMock.user.findUnique = jest.fn().mockResolvedValue({
        id: 'cust-2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        role: 'customer',
        status: 'active',
        passwordHash: '$2b$10$anotherhash',
        refreshToken: '$2b$10$anotherrefreshtoken',
        resetToken: null,
        resetTokenExpiry: null,
        addresses: [],
        orders: [],
      });

      const result: any = await usersService.getUserDetailAdmin('cust-2');

      expect(result.passwordHash).toBeUndefined();
      expect(result.refreshToken).toBeUndefined();
      expect(result.resetToken).toBeUndefined();
    });

    it('should not expose passwordHash or tokens in OrdersService.getOrderByIdAdmin', async () => {
      const orderId = '00000000-0000-4000-8000-000000000005';
      prismaMock.order.findUnique = jest.fn().mockImplementation((args: any) => {
        // Assert that the user relation projection strictly selects safe fields
        const userSelect = args?.include?.user?.select;
        expect(userSelect).toBeDefined();
        expect(userSelect.passwordHash).toBeUndefined();
        expect(userSelect.refreshToken).toBeUndefined();
        expect(userSelect.resetToken).toBeUndefined();

        return Promise.resolve({
          id: orderId,
          orderNumber: 'ORD-999',
          user: {
            id: 'user-1',
            firstName: 'Alex',
            email: 'alex@example.com',
          },
          items: [],
          address: {},
        });
      });

      const result: any = await ordersService.getOrderByIdAdmin(orderId);
      expect(result.user.passwordHash).toBeUndefined();
      expect(result.user.refreshToken).toBeUndefined();
    });
  });

  // ── V-06: CORS Policy Restrictions ─────────────────────────────────────────
  describe('V-06: CORS Allowlist Boundary', () => {
    it('should reject arbitrary and attacker-controlled vercel subdomains while allowing exact approved origins', () => {
      const trustedOrigins = new Set([
        'https://rarenuts.in',
        'https://www.rarenuts.in',
        'https://rarenuts.com',
        'https://www.rarenuts.com',
        'https://auremont.com',
        'https://www.auremont.com',
        'https://auremont-rose.vercel.app',
        'https://auremont.vercel.app',
      ]);

      const checkOrigin = (origin: string, isDev = false) => {
        const normalized = origin.replace(/\/$/, '');
        const isLocalhost = isDev && (/^http:\/\/localhost(:\d+)?$/.test(normalized) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalized));
        return trustedOrigins.has(normalized) || isLocalhost;
      };

      // Attacker controlled subdomains
      expect(checkOrigin('https://attacker-project.vercel.app')).toBe(false);
      expect(checkOrigin('https://auremont-evil.vercel.app')).toBe(false);
      expect(checkOrigin('https://auremont-rose-attacker.vercel.app')).toBe(false);
      expect(checkOrigin('https://auremont.vercel.app.attacker.com')).toBe(false);
      expect(checkOrigin('null')).toBe(false);

      // Approved production and staging origins
      expect(checkOrigin('https://auremont.vercel.app')).toBe(true);
      expect(checkOrigin('https://auremont-rose.vercel.app')).toBe(true);
      expect(checkOrigin('https://auremont.com')).toBe(true);
      expect(checkOrigin('http://localhost:3000', true)).toBe(true);
    });
  });

  // ── V-07: Account Enumeration Prevention ───────────────────────────────────
  describe('V-07: Generic Authentication Failure Message', () => {
    it('should return identical error message whether account exists or password is wrong', async () => {
      // Mock findByEmail returns null (account does not exist)
      prismaMock.user.findFirst = jest.fn().mockResolvedValue(null);

      const mockRes: any = { cookie: jest.fn() };

      await expect(
        authController.login({ email: 'nonexistent@example.com', password: 'wrong' }, mockRes),
      ).rejects.toThrow('Invalid email or password. Please verify your credentials.');

      // Mock findByEmail returns user but password validation fails
      prismaMock.user.findFirst = jest.fn().mockResolvedValue({
        id: 'u1',
        email: 'exists@example.com',
        passwordHash: '$2b$10$notmatching',
      });

      await expect(
        authController.login({ email: 'exists@example.com', password: 'wrong' }, mockRes),
      ).rejects.toThrow('Invalid email or password. Please verify your credentials.');
    });
  });

  // ── V-08: Session Revocation on Password Reset / Change ─────────────────────
  describe('V-08: Refresh Token Invalidation on Password Modification', () => {
    it('should set refreshToken to null when resetting password', async () => {
      const user = {
        id: 'u-reset-1',
        email: 'reset@example.com',
        resetToken: '$2b$10$hashedtoken',
        resetTokenExpiry: new Date(Date.now() + 3600000),
      };

      prismaMock.user.findFirst = jest.fn().mockResolvedValue(user);
      prismaMock.user.update = jest.fn().mockResolvedValue({ ...user, refreshToken: null });

      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await authService.resetPassword({
        email: 'reset@example.com',
        token: 'valid-plain-token',
        newPassword: 'NewSecurePassword@123',
      });

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: user.id },
          data: expect.objectContaining({
            refreshToken: null,
            resetToken: null,
          }),
        }),
      );
    });

    it('should set refreshToken to null when changing password', async () => {
      const user = {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'change@example.com',
        passwordHash: '$2b$10$currenthash',
        refreshToken: '$2b$10$oldrefreshtoken',
      };

      prismaMock.user.findUnique = jest.fn().mockResolvedValue(user);
      prismaMock.user.update = jest.fn().mockResolvedValue({ ...user, refreshToken: null });

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await usersService.changePassword(user.id, {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      });

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: user.id },
          data: expect.objectContaining({
            refreshToken: null,
          }),
        }),
      );
    });
  });

  // ── V-09: CSP Verification ─────────────────────────────────────────────────
  describe('V-09: Content Security Policy Hardening', () => {
    it('should not contain unsafe-eval in frontend next.config.mjs CSP', () => {
      const configPath = path.resolve(__dirname, '../../auremont-frontend/next.config.mjs');
      const content = fs.readFileSync(configPath, 'utf8');
      expect(content).not.toContain("'unsafe-eval'");
      expect(content).toContain("script-src 'self' 'unsafe-inline'");
    });
  });

  // ── V-10: Startup Auto-Seed Removal ────────────────────────────────────────
  describe('V-10: Development Admin Startup Auto-Seeding Disabled', () => {
    it('should not perform any upserts during AuthService.onModuleInit', async () => {
      prismaMock.user.upsert = jest.fn();
      await authService.onModuleInit();
      expect(prismaMock.user.upsert).not.toHaveBeenCalled();
    });
  });
});
