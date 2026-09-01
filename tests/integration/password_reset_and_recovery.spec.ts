import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auremont-backend/src/auth/auth.service';
import { MailService } from '../../auremont-backend/src/auth/mail.service';
import { CartRecoveryService } from '../../auremont-backend/src/cart/cart-recovery.service';
import { UsersService } from '../../auremont-backend/src/users/users.service';
import { PrismaService } from '../../auremont-backend/src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaService } from '../../auremont-backend/src/prisma/prisma.service.mock';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('Password Reset & Abandoned Cart Recovery Integration Tests', () => {
  let authService: AuthService;
  let cartRecoveryService: CartRecoveryService;
  let prismaMock: any;
  let mailServiceMock: any;

  const testUser = {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'client@rarenuts.com',
    firstName: 'Julian',
    lastName: 'Sterling',
    passwordHash: '',
    role: 'customer',
    resetToken: null,
    resetTokenExpiry: null,
  };

  beforeEach(async () => {
    testUser.passwordHash = await bcrypt.hash('OldPassword123', 10);
    testUser.resetToken = null;
    testUser.resetTokenExpiry = null;

    prismaMock = createMockPrismaService();
    prismaMock._seed('users', [testUser]);

    mailServiceMock = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
      sendEmail: jest.fn().mockResolvedValue({ success: true }),
    };

    const usersServiceMock = {
      findByEmail: jest.fn(async (email: string) => {
        const users = prismaMock._getDb().users;
        return users.find((u: any) => u.email === email) || null;
      }),
      create: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue('jwt_token_mock'),
      verify: jest.fn().mockReturnValue({ sub: testUser.id, email: testUser.email }),
    };

    authService = new AuthService(
      usersServiceMock as any,
      prismaMock as any,
      jwtServiceMock as any,
      mailServiceMock as any,
    );
    cartRecoveryService = new CartRecoveryService(prismaMock as any);
  });

  describe('Password Reset End-to-End', () => {
    it('should issue a reset token, dispatch email, and allow password reset', async () => {
      // 1. Request forgot password
      const forgotRes = await authService.forgotPassword('client@rarenuts.com');
      expect(forgotRes.message).toContain('reset link has been sent');
      expect(mailServiceMock.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

      // Extract generated reset token from mock call
      const generatedToken = mailServiceMock.sendPasswordResetEmail.mock.calls[0][1];
      expect(generatedToken).toBeDefined();

      // 2. Perform password reset with token
      const resetRes = await authService.resetPassword({
        email: 'client@rarenuts.com',
        token: generatedToken,
        newPassword: 'NewSecurePassword123!',
      });

      expect(resetRes.message).toBe('Password reset successfully');

      // Verify password was updated and reset token cleared
      const updatedUser = prismaMock._getDb().users.find((u: any) => u.email === 'client@rarenuts.com');
      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();

      const isNewPasswordValid = await bcrypt.compare('NewSecurePassword123!', updatedUser.passwordHash);
      expect(isNewPasswordValid).toBe(true);
    });

    it('should reject password reset with an invalid or tampered token', async () => {
      await authService.forgotPassword('client@rarenuts.com');

      await expect(
        authService.resetPassword({
          email: 'client@rarenuts.com',
          token: 'invalid_tampered_token',
          newPassword: 'NewPassword123',
        }),
      ).rejects.toThrow('Invalid or expired reset token');
    });

    it('should reject password reset if token has expired', async () => {
      const expiredToken = 'expired_token_123';
      const hashedExpiredToken = await bcrypt.hash(expiredToken, 10);
      const user = prismaMock._getDb().users.find((u: any) => u.email === 'client@rarenuts.com');
      user.resetToken = hashedExpiredToken;
      user.resetTokenExpiry = new Date(Date.now() - 1000 * 60 * 10); // 10 minutes in past

      await expect(
        authService.resetPassword({
          email: 'client@rarenuts.com',
          token: expiredToken,
          newPassword: 'NewPassword123',
        }),
      ).rejects.toThrow('Reset token has expired');
    });
  });

  describe('Abandoned Cart Recovery Workflow', () => {
    it('should scan idle carts, generate outbox event, and avoid duplicate reminders', async () => {
      const idleCart = {
        id: 'cart-idle-001',
        userId: testUser.id,
        status: 'active',
        updatedAt: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes idle
        user: testUser,
        items: [
          {
            id: 'item-1',
            quantity: 2,
            product: { name: 'Smoked Sea Salt Almonds' },
          },
        ],
      };

      prismaMock._seed('carts', [idleCart]);

      // First run: should process and recover
      const run1 = await cartRecoveryService.processAbandonedCarts();
      expect(run1.scanned).toBe(1);
      expect(run1.recovered).toBe(1);

      const outbox = prismaMock._getDb().outboxEvents;
      expect(outbox.length).toBe(1);
      expect(outbox[0].eventType).toBe('abandoned_cart_reminder');
      expect(outbox[0].payload.email).toBe('client@rarenuts.com');

      // Second run: duplicate detection should prevent resending
      const run2 = await cartRecoveryService.processAbandonedCarts();
      expect(run2.recovered).toBe(0);
    });
  });
});
