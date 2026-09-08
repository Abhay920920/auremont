/* eslint-disable max-lines-per-function, complexity, @typescript-eslint/no-explicit-any */
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { assertValidUuid, isValidUuid } from './common/uuid-validator';
import { AdminCustomersService } from './admin/customers/customers.service';
import { UsersService } from './users/users.service';
import { ReviewsService } from './reviews/reviews.service';
import { WishlistService } from './wishlist/wishlist.service';
import { PaymentsService } from './payments/payments.service';
import { createMockPrismaService } from './prisma/prisma.service.mock';
import * as crypto from 'crypto';

describe('RARE NUTS — NoSQL & Prisma Query Operator Injection Adversarial Test Suite', () => {
  let prismaMock: any;
  let adminCustomersService: AdminCustomersService;
  let usersService: UsersService;
  let reviewsService: ReviewsService;
  let wishlistService: WishlistService;
  let paymentsService: PaymentsService;

  const validUuid = 'c7b3d8e0-5e0b-4b0f-8b3a-6b4f7d2e1a0b';
  const targetUserUuid = 'e2a1b0c9-4d8e-4a7b-9c6d-5e4f3a2b1c0d';
  const adminUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

  beforeEach(() => {
    prismaMock = createMockPrismaService();
    adminCustomersService = new AdminCustomersService(prismaMock);
    usersService = new UsersService(prismaMock);
    const mockAudit: any = { log: jest.fn().mockResolvedValue(true) };
    reviewsService = new ReviewsService(prismaMock, mockAudit);
    wishlistService = new WishlistService(prismaMock);
    paymentsService = new PaymentsService(prismaMock);

    process.env.RAZORPAY_KEY_SECRET = 'test_secret_key_12345';
    process.env.RAZORPAY_KEY_ID = 'rzp_test_12345';
  });

  // ── 1. Service Boundary UUID / Scalar Invariant Enforcement ────────────────
  describe('1. UUID & Scalar Invariant Type Enforcement', () => {
    it('ALLOW: accepts a standard RFC 4122 v4 UUID string', () => {
      expect(isValidUuid(validUuid)).toBe(true);
      expect(assertValidUuid(validUuid, 'test id')).toBe(validUuid);
    });

    it('DENY: rejects MongoDB-style operator object { "$ne": "..." }', () => {
      const maliciousPayload = { $ne: validUuid };
      expect(isValidUuid(maliciousPayload)).toBe(false);
      expect(() => assertValidUuid(maliciousPayload, 'test id')).toThrow(BadRequestException);
      expect(() => assertValidUuid(maliciousPayload, 'test id')).toThrow(/must be a valid UUID/);
    });

    it('DENY: rejects Prisma-style operator object { "not": "..." }', () => {
      const maliciousPayload = { not: validUuid };
      expect(isValidUuid(maliciousPayload)).toBe(false);
      expect(() => assertValidUuid(maliciousPayload, 'test id')).toThrow(BadRequestException);
    });

    it('DENY: rejects empty object {}', () => {
      expect(isValidUuid({})).toBe(false);
      expect(() => assertValidUuid({}, 'test id')).toThrow(BadRequestException);
    });

    it('DENY: rejects array injection ["id1", "id2"]', () => {
      expect(isValidUuid([validUuid])).toBe(false);
      expect(() => assertValidUuid([validUuid], 'test id')).toThrow(BadRequestException);
    });

    it('DENY: rejects null and undefined', () => {
      expect(isValidUuid(null)).toBe(false);
      expect(isValidUuid(undefined)).toBe(false);
      expect(() => assertValidUuid(null, 'test id')).toThrow(BadRequestException);
      expect(() => assertValidUuid(undefined, 'test id')).toThrow(BadRequestException);
    });

    it('DENY: rejects numbers and booleans', () => {
      expect(isValidUuid(12345)).toBe(false);
      expect(isValidUuid(true)).toBe(false);
      expect(() => assertValidUuid(12345, 'test id')).toThrow(BadRequestException);
    });

    it('DENY: in production mode, strictly rejects non-UUID strings', () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'production';
        expect(isValidUuid('cust-1')).toBe(false);
        expect(isValidUuid('malformed-uuid-12345')).toBe(false);
        expect(isValidUuid(validUuid)).toBe(true);
        expect(() => assertValidUuid('cust-1', 'customer id')).toThrow(BadRequestException);
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  // ── 2. Admin Customer Inspection & Query Hardening ─────────────────────────
  describe('2. Admin Customers Service Boundary Hardening', () => {
    it('DENY: rejects object-shaped customer id in findOne', async () => {
      const maliciousId: any = { $ne: validUuid };
      await expect(adminCustomersService.findOne(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: rejects array-shaped customer id in findOne', async () => {
      const maliciousId: any = [validUuid];
      await expect(adminCustomersService.findOne(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: rejects object-shaped customer id in updateStatus', async () => {
      const maliciousId: any = { not: validUuid };
      await expect(
        adminCustomersService.updateStatus(maliciousId, { status: 'blocked' } as any, adminUuid),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: rejects object-shaped admin id in updateStatus', async () => {
      const maliciousAdminId: any = { $gt: '' };
      await expect(
        adminCustomersService.updateStatus(validUuid, { status: 'blocked' } as any, maliciousAdminId),
      ).rejects.toThrow(BadRequestException);
    });

    it('SAFE: search filter parameter sanitizes non-string objects to safe string', async () => {
      prismaMock.user.findMany = jest.fn().mockResolvedValue([]);
      prismaMock.user.count = jest.fn().mockResolvedValue(0);

      // Pass malicious object as search query
      const result = await adminCustomersService.findAll(1, 20, { not: 'admin' } as any);
      expect(result.data).toEqual([]);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'customer',
          }),
        }),
      );
    });
  });

  // ── 3. User Administration & Account Deletion Boundary ─────────────────────
  describe('3. User Service Boundary & Deletion Safety', () => {
    it('DENY: deleteUserAdmin rejects object-shaped id payload', async () => {
      const maliciousId: any = { $ne: 'deleted' };
      await expect(usersService.deleteUserAdmin(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: deleteUserAdmin rejects array-shaped id payload', async () => {
      const maliciousId: any = [validUuid, targetUserUuid];
      await expect(usersService.deleteUserAdmin(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: getUserDetailAdmin rejects object-shaped id payload', async () => {
      const maliciousId: any = { not: validUuid };
      await expect(usersService.getUserDetailAdmin(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: deleteMyAccount rejects non-UUID userId with UnauthorizedException', async () => {
      const maliciousUserId: any = { $ne: 'me' };
      await expect(
        usersService.deleteMyAccount(maliciousUserId, { password: 'pwd', confirmText: 'DELETE' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('DENY: deleteMyAccount rejects when confirmation text is incorrect', async () => {
      prismaMock._seed('users', [{ id: validUuid, email: 'user@example.com', role: 'customer' }]);
      await expect(
        usersService.deleteMyAccount(validUuid, { password: 'pwd', confirmText: 'WRONG TEXT' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: deleteMyAccount prevents admin from deleting self via customer endpoint', async () => {
      prismaMock._seed('users', [{ id: validUuid, email: 'admin@example.com', role: 'admin' }]);
      await expect(
        usersService.deleteMyAccount(validUuid, { password: 'pwd', confirmText: 'DELETE' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        usersService.deleteMyAccount(validUuid, { password: 'pwd', confirmText: 'DELETE' }),
      ).rejects.toThrow(/Administrative accounts cannot be deleted/);
    });

    it('DENY: deleteMyAccount blocks deletion if user has active/in-progress orders', async () => {
      prismaMock._seed('users', [{
        id: validUuid,
        email: 'user@example.com',
        role: 'customer',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuu',
      }]);
      prismaMock._seed('orders', [{
        id: 'ord-active-1',
        userId: validUuid,
        orderStatus: 'placed',
        paymentStatus: 'paid',
      }]);

      await expect(
        usersService.deleteMyAccount(validUuid, { password: 'pwd', confirmText: 'DELETE' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── 4. Reviews Service & Status Allowlist Hardening ─────────────────────────
  describe('4. Reviews Service Operator & Type Injection Protection', () => {
    it('DENY: getProductReviews rejects object-shaped productId', async () => {
      const maliciousId: any = { $ne: 'prod-1' };
      await expect(reviewsService.getProductReviews(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: getUserReviews rejects object-shaped userId', async () => {
      const maliciousId: any = { not: validUuid };
      await expect(reviewsService.getUserReviews(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: getAllReviews rejects object-shaped status filter payload', async () => {
      const maliciousStatus: any = { not: 'rejected' };
      await expect(reviewsService.getAllReviews(maliciousStatus)).rejects.toThrow(BadRequestException);
      await expect(reviewsService.getAllReviews(maliciousStatus)).rejects.toThrow(/Invalid review status/);
    });

    it('DENY: getAllReviews rejects arbitrary unrecognized string status', async () => {
      await expect(reviewsService.getAllReviews('drop_table' as any)).rejects.toThrow(BadRequestException);
    });

    it('ALLOW: getAllReviews accepts valid allowlisted review statuses', async () => {
      prismaMock.review.findMany = jest.fn().mockResolvedValue([]);
      await expect(reviewsService.getAllReviews('approved')).resolves.toEqual([]);
      await expect(reviewsService.getAllReviews('pending')).resolves.toEqual([]);
      await expect(reviewsService.getAllReviews('rejected')).resolves.toEqual([]);
    });

    it('DENY: moderateReview rejects object review id', async () => {
      const maliciousId: any = { $gt: '' };
      await expect(
        reviewsService.moderateReview(maliciousId, { status: 'approved' } as any, adminUuid),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: deleteReview rejects object review id', async () => {
      const maliciousId: any = { $ne: 'xyz' };
      await expect(reviewsService.deleteReview(maliciousId, adminUuid)).rejects.toThrow(BadRequestException);
    });
  });

  // ── 5. Wishlist Service Boundary Hardening ─────────────────────────────────
  describe('5. Wishlist Service Type Injection Protection', () => {
    it('DENY: getWishlist rejects object-shaped userId', async () => {
      const maliciousId: any = { $ne: 'user' };
      await expect(wishlistService.getWishlist(maliciousId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: addProduct rejects object-shaped productId', async () => {
      const maliciousProductId: any = { not: 'some-prod' };
      await expect(wishlistService.addProduct(validUuid, maliciousProductId)).rejects.toThrow(BadRequestException);
    });

    it('DENY: removeProduct rejects object-shaped productId', async () => {
      const maliciousProductId: any = { $ne: 'some-prod' };
      await expect(wishlistService.removeProduct(validUuid, maliciousProductId)).rejects.toThrow(BadRequestException);
    });
  });

  // ── 6. Payments Verification & State Machine Protection ────────────────────
  describe('6. Payments Service Defense-in-Depth & Parameter Safety', () => {
    it('DENY: verifyPayment rejects object-shaped razorpayOrderId', async () => {
      const maliciousOrderId: any = { $ne: 'order_123' };
      await expect(
        paymentsService.verifyPayment(maliciousOrderId, 'pay_123', 'sig_123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        paymentsService.verifyPayment(maliciousOrderId, 'pay_123', 'sig_123'),
      ).rejects.toThrow(/must be valid scalar strings/);
    });

    it('DENY: verifyPayment rejects object-shaped razorpayPaymentId', async () => {
      const maliciousPaymentId: any = { not: 'pay_123' };
      await expect(
        paymentsService.verifyPayment('order_123', maliciousPaymentId, 'sig_123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: verifyPayment rejects object-shaped signature', async () => {
      const maliciousSignature: any = { $gt: '' };
      await expect(
        paymentsService.verifyPayment('order_123', 'pay_123', maliciousSignature),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: verifyPayment rejects object-shaped internalOrderId', async () => {
      const maliciousInternalId: any = { not: 'ord-123' };
      await expect(
        paymentsService.verifyPayment('order_123', 'pay_123', 'sig_123', maliciousInternalId),
      ).rejects.toThrow(BadRequestException);
    });

    it('DENY: createRazorpayOrder rejects object-shaped orderId', async () => {
      const maliciousOrderId: any = { $ne: 'ord-123' };
      await expect(paymentsService.createRazorpayOrder(maliciousOrderId, 1299)).rejects.toThrow(BadRequestException);
    });

    it('DENY: generateOrderToken rejects object-shaped orderId', () => {
      const maliciousOrderId: any = { not: 'ord-123' };
      expect(() => paymentsService.generateOrderToken(maliciousOrderId)).toThrow(BadRequestException);
    });

    it('DENY: verifyOrderToken rejects object-shaped orderId', () => {
      const maliciousOrderId: any = { not: 'ord-123' };
      expect(() => paymentsService.verifyOrderToken(maliciousOrderId, 'token_123')).toThrow(BadRequestException);
    });

    it('SECURE: verifyPayment validates cryptographic HMAC signature before any database state modification', async () => {
      const orderId = 'order_rzp_secure_123';
      const paymentId = 'pay_rzp_secure_456';
      const invalidSignature = 'invalid_tampered_signature_hex_value';

      await expect(
        paymentsService.verifyPayment(orderId, paymentId, invalidSignature),
      ).rejects.toThrow(BadRequestException);
      await expect(
        paymentsService.verifyPayment(orderId, paymentId, invalidSignature),
      ).rejects.toThrow(/Payment signature verification failed/);
    });
  });

  // ── 7. Error Sanitization & Information Leakage ────────────────────────────
  describe('7. Error Sanitization & Exception Safety', () => {
    it('SAFE: validation failures throw clean application messages without leaking DB or SQL syntax', async () => {
      try {
        await adminCustomersService.findOne({ $ne: 'test' } as any);
        fail('Expected exception was not thrown');
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        const response = err.getResponse();
        const message = typeof response === 'object' ? response.message : response;
        expect(message).not.toMatch(/prisma/i);
        expect(message).not.toMatch(/select/i);
        expect(message).not.toMatch(/postgres/i);
        expect(message).not.toMatch(/P200/i);
      }
    });
  });
});
