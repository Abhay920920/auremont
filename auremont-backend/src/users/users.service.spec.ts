import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService - Account Deletion', () => {
  let service: UsersService;
  let prismaMock: any;

  const validUserId = '11111111-1111-4111-a111-111111111111';
  const adminUserId = '22222222-2222-4222-a222-222222222222';

  beforeEach(async () => {
    prismaMock = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('deleteMyAccount input validation & guards', () => {
    it('should throw UnauthorizedException when userId is not a valid UUID', async () => {
      await expect(
        service.deleteMyAccount('invalid-uuid', { confirmText: 'DELETE' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when confirmText is not DELETE', async () => {
      await expect(
        service.deleteMyAccount(validUserId, { confirmText: 'YES' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(
        service.deleteMyAccount(validUserId, { confirmText: 'DELETE' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is already inactive or deleted', async () => {
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'deleted_user@anonymized.invalid',
          status: 'inactive',
        },
      ]);

      await expect(
        service.deleteMyAccount(validUserId, { confirmText: 'DELETE' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user has admin role', async () => {
      prismaMock._seed('users', [
        {
          id: adminUserId,
          email: 'admin@auremont.com',
          role: 'admin',
          status: 'active',
        },
      ]);

      await expect(
        service.deleteMyAccount(adminUserId, { confirmText: 'DELETE' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Re-authentication verification', () => {
    it('should throw BadRequestException when password is required but not provided', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'client@auremont.com',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);

      await expect(
        service.deleteMyAccount(validUserId, { confirmText: 'DELETE' }),
      ).rejects.toThrow('Your current password is required');
    });

    it('should throw BadRequestException when provided password is incorrect', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'client@auremont.com',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);

      await expect(
        service.deleteMyAccount(validUserId, {
          password: 'WrongPassword!',
          confirmText: 'DELETE',
        }),
      ).rejects.toThrow('Incorrect password');
    });
  });

  describe('Active orders & in-flight payments protection', () => {
    it('should block deletion if user has an order with active status (placed/confirmed/packed/shipped)', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'client@auremont.com',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);
      prismaMock._seed('orders', [
        {
          id: 'order-active-1',
          userId: validUserId,
          orderStatus: 'shipped',
          paymentStatus: 'paid',
        },
      ]);

      await expect(
        service.deleteMyAccount(validUserId, {
          password: 'SecurePass123!',
          confirmText: 'DELETE',
        }),
      ).rejects.toThrow('active orders or in-progress payments');
    });

    it('should block deletion if user has a pending or processing payment', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'client@auremont.com',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);
      prismaMock._seed('orders', [
        {
          id: 'order-pending-pay',
          userId: validUserId,
          orderStatus: 'placed',
          paymentStatus: 'processing',
        },
      ]);

      await expect(
        service.deleteMyAccount(validUserId, {
          password: 'SecurePass123!',
          confirmText: 'DELETE',
        }),
      ).rejects.toThrow('active orders or in-progress payments');
    });
  });

  describe('Successful deletion for user with ZERO orders (Hard Delete)', () => {
    it('should purge all personal data, reviews, and delete user row', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'clean.client@auremont.com',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);
      prismaMock._seed('carts', [{ id: 'cart-1', userId: validUserId }]);
      prismaMock._seed('cartItems', [{ id: 'item-1', cartId: 'cart-1' }]);
      prismaMock._seed('wishlists', [{ id: 'w-1', userId: validUserId, productId: 'p-1' }]);
      prismaMock._seed('notifications', [{ id: 'n-1', userId: validUserId }]);
      prismaMock._seed('addresses', [
        { id: 'addr-1', userId: validUserId, fullName: 'Clean Client', orders: [] },
      ]);
      prismaMock._seed('reviews', [{ id: 'rev-1', userId: validUserId, rating: 5 }]);

      const result = await service.deleteMyAccount(validUserId, {
        password: 'SecurePass123!',
        confirmText: 'DELETE',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted successfully');

      const db = prismaMock._getDb();
      expect(db.users.find((u: any) => u.id === validUserId)).toBeUndefined();
      expect(db.carts.find((c: any) => c.userId === validUserId)).toBeUndefined();
      expect(db.cartItems.length).toBe(0);
      expect(db.wishlists.length).toBe(0);
      expect(db.notifications.length).toBe(0);
      expect(db.addresses.length).toBe(0);
      expect(db.reviews.length).toBe(0);
      expect(db.auditLogs.some((a: any) => a.action === 'ACCOUNT_DELETED')).toBe(true);
    });
  });

  describe('Successful deletion for user with COMPLETED orders (Anonymization)', () => {
    it('should anonymize user row and linked address, retaining order and payment records', async () => {
      const hash = await bcrypt.hash('SecurePass123!', 10);
      prismaMock._seed('users', [
        {
          id: validUserId,
          email: 'historical.client@auremont.com',
          firstName: 'Alexander',
          lastName: 'Vane',
          phone: '+919876543210',
          role: 'customer',
          status: 'active',
          passwordHash: hash,
        },
      ]);
      prismaMock._seed('addresses', [
        {
          id: 'addr-order-linked',
          userId: validUserId,
          fullName: 'Alexander Vane',
          phone: '+919876543210',
          addressLine1: '123 Luxury Boulevard',
        },
      ]);
      prismaMock._seed('orders', [
        {
          id: 'order-historical-1',
          userId: validUserId,
          addressId: 'addr-order-linked',
          orderStatus: 'delivered',
          paymentStatus: 'paid',
        },
      ]);
      prismaMock._seed('payments', [
        {
          id: 'pay-historical-1',
          orderId: 'order-historical-1',
          amount: 5000,
          status: 'captured',
        },
      ]);
      prismaMock._seed('carts', [{ id: 'cart-1', userId: validUserId }]);
      prismaMock._seed('cartItems', [{ id: 'item-1', cartId: 'cart-1' }]);

      const result = await service.deleteMyAccount(validUserId, {
        password: 'SecurePass123!',
        confirmText: 'delete', // case-insensitive
      });

      expect(result.success).toBe(true);

      const db = prismaMock._getDb();
      const anonymizedUser = db.users.find((u: any) => u.id === validUserId);
      expect(anonymizedUser).toBeDefined();
      expect(anonymizedUser.firstName).toBe('Deleted');
      expect(anonymizedUser.lastName).toBe('Customer');
      expect(anonymizedUser.email).toBe(`deleted_${validUserId}@anonymized.invalid`);
      expect(anonymizedUser.phone).toBeNull();
      expect(anonymizedUser.passwordHash).toBeNull();
      expect(anonymizedUser.status).toBe('inactive');
      expect(anonymizedUser.refreshToken).toBeNull();

      // Verify order and payment records remain intact
      expect(db.orders.length).toBe(1);
      expect(db.orders[0].id).toBe('order-historical-1');
      expect(db.payments.length).toBe(1);

      // Verify linked address was redacted
      const redactedAddr = db.addresses.find((a: any) => a.id === 'addr-order-linked');
      expect(redactedAddr.fullName).toBe('Deleted Customer');
      expect(redactedAddr.phone).toBe('0000000000');
      expect(redactedAddr.addressLine1).toBe('[Redacted for Privacy]');

      // Verify cart was purged
      expect(db.carts.length).toBe(0);
      expect(db.cartItems.length).toBe(0);

      // Verify system audit log was created
      expect(db.auditLogs.some((a: any) => a.action === 'ACCOUNT_DELETED')).toBe(true);
    });
  });
});
