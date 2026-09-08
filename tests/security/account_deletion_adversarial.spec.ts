import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../auremont-backend/src/users/users.service';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import * as bcrypt from 'bcrypt';

describe('RARE NUTS — Account Deletion Adversarial & Security Tests', () => {
  let usersService: UsersService;
  let prismaMock: any;

  const validUserId = '11111111-1111-4111-a111-111111111111';
  const victimUserId = '22222222-2222-4222-a222-222222222222';
  const adminUserId = '33333333-3333-4333-a333-333333333333';
  const rawPassword = 'LuxuryPassword!2026';
  let hashedPassword = '';

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(rawPassword, 10);
  });

  beforeEach(() => {
    prismaMock = createMockPrismaService();

    prismaMock._seed('users', [
      {
        id: validUserId,
        email: 'client@rarenuts.com',
        passwordHash: hashedPassword,
        role: 'customer',
        status: 'active',
        firstName: 'Alexander',
        lastName: 'Vance',
        phone: '+919876543210',
        refreshToken: 'valid-refresh-token',
      },
      {
        id: victimUserId,
        email: 'victim@rarenuts.com',
        passwordHash: hashedPassword,
        role: 'customer',
        status: 'active',
        firstName: 'Victoria',
        lastName: 'Sinclair',
        phone: '+919999999999',
      },
      {
        id: adminUserId,
        email: 'admin@rarenuts.com',
        passwordHash: hashedPassword,
        role: 'admin',
        status: 'active',
        firstName: 'Administrator',
        lastName: 'System',
      },
    ]);

    prismaMock._seed('orders', []);
    prismaMock._seed('carts', [{ id: 'cart-1', userId: validUserId, items: [] }]);
    prismaMock._seed('wishlists', [{ id: 'wish-1', userId: validUserId, productId: 'prod-1' }]);
    prismaMock._seed('notifications', [{ id: 'notif-1', userId: validUserId, title: 'VIP Alert' }]);
    prismaMock._seed('addresses', [{ id: 'addr-1', userId: validUserId, fullName: 'Alexander Vance', phone: '+919876543210', addressLine1: 'Villa 1' }]);
    prismaMock._seed('auditLogs', [{ id: 'audit-1', userId: validUserId, action: 'LOGIN' }]);
    prismaMock._seed('reviews', [{ id: 'rev-1', userId: validUserId, rating: 5, comment: 'Exquisite' }]);
    prismaMock._seed('payments', []);

    usersService = new UsersService(prismaMock as any);
  });

  describe('Adversarial IDOR & Context Binding', () => {
    it('should reject non-UUID or hijacked user identity inputs', async () => {
      const maliciousIds = [
        "' OR 1=1 --",
        "../admin/users",
        "<script>alert(1)</script>",
        "invalid-uuid-string",
        "not-a-valid-uuid-here",
      ];

      for (const malId of maliciousIds) {
        await expect(
          usersService.deleteMyAccount(malId, { password: rawPassword, confirmText: 'DELETE' })
        ).rejects.toThrow(UnauthorizedException);
      }
    });

    it('should prevent targeting other accounts because deleteMyAccount operates strictly on the authenticated subject', async () => {
      await usersService.deleteMyAccount(validUserId, { password: rawPassword, confirmText: 'DELETE' });

      const db = prismaMock._getDb();
      const victim = db.users.find((u: any) => u.id === victimUserId);
      expect(victim).toBeDefined();
      expect(victim.status).toBe('active');
      expect(victim.email).toBe('victim@rarenuts.com');
    });
  });

  describe('Administrative Immunity', () => {
    it('should strictly reject self-deletion attempts by administrators to prevent accidental store lockout', async () => {
      await expect(
        usersService.deleteMyAccount(adminUserId, { password: rawPassword, confirmText: 'DELETE' })
      ).rejects.toThrow(BadRequestException);

      const db = prismaMock._getDb();
      const admin = db.users.find((u: any) => u.id === adminUserId);
      expect(admin).toBeDefined();
      expect(admin.status).toBe('active');
    });
  });

  describe('Adversarial Confirmation Bypasses', () => {
    it('should reject non-DELETE confirmation text variants', async () => {
      const invalidPhrases = [
        'CONFIRM',
        'YES',
        'true',
        'CANCEL',
        'REMOVE',
        'DESTROY',
        'ABORT',
      ];

      for (const phrase of invalidPhrases) {
        await expect(
          usersService.deleteMyAccount(validUserId, { password: rawPassword, confirmText: phrase })
        ).rejects.toThrow(BadRequestException);
      }
    });
  });

  describe('Fraud Prevention: Active Orders & In-Flight Payments Gating', () => {
    it('should block deletion if user has an order placed or in-transit', async () => {
      const activeStatuses = ['placed', 'confirmed', 'packed', 'shipped'];

      for (const status of activeStatuses) {
        prismaMock._seed('orders', [
          {
            id: `ord-active-${status}`,
            userId: validUserId,
            orderStatus: status,
            paymentStatus: 'paid',
          },
        ]);

        await expect(
          usersService.deleteMyAccount(validUserId, { password: rawPassword, confirmText: 'DELETE' })
        ).rejects.toThrow('active orders or in-progress payments');
      }
    });

    it('should block deletion if user has a pending or processing payment transaction', async () => {
      prismaMock._seed('orders', [
        {
          id: 'ord-pay-pending',
          userId: validUserId,
          orderStatus: 'placed',
          paymentStatus: 'processing',
        },
      ]);

      await expect(
        usersService.deleteMyAccount(validUserId, { password: rawPassword, confirmText: 'DELETE' })
      ).rejects.toThrow('active orders or in-progress payments');
    });
  });

  describe('Post-Deletion Integrity & Credential Invalidation', () => {
    it('should purge session tokens, redact PII, and mark account inactive when historical orders exist', async () => {
      prismaMock._seed('orders', [
        {
          id: 'ord-delivered-1',
          userId: validUserId,
          addressId: 'addr-1',
          orderStatus: 'delivered',
          paymentStatus: 'paid',
        },
      ]);

      const res = await usersService.deleteMyAccount(validUserId, {
        password: rawPassword,
        confirmText: 'DELETE',
      });

      expect(res.success).toBe(true);

      const db = prismaMock._getDb();
      const anonymizedUser = db.users.find((u: any) => u.id === validUserId);

      expect(anonymizedUser).toBeDefined();
      expect(anonymizedUser.status).toBe('inactive');
      expect(anonymizedUser.passwordHash).toBeNull();
      expect(anonymizedUser.refreshToken).toBeNull();
      expect(anonymizedUser.phone).toBeNull();
      expect(anonymizedUser.email).toContain('@anonymized.invalid');
      expect(anonymizedUser.firstName).toBe('Deleted');
      expect(anonymizedUser.lastName).toBe('Customer');

      // Subsequent attempt to delete already inactive account must fail with NotFoundException
      await expect(
        usersService.deleteMyAccount(validUserId, { password: rawPassword, confirmText: 'DELETE' })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
