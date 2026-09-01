import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from '../../auremont-backend/src/app.module';
import { UsersService } from '../../auremont-backend/src/users/users.service';
import { AdminAuthGuard } from '../../auremont-backend/src/admin/auth/admin-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('RARE NUTS — Adversarial Security Tests', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService, { strict: false });
    jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'AUREMONT_LUXURY_SECRET_KEY' });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });


  const JWT_SECRET = process.env.JWT_SECRET || 'AUREMONT_LUXURY_SECRET_KEY';

  describe('Admin Authorization & Escalation Checks', () => {
    it('should reject non-admin users attempting to perform administrative actions', async () => {
      // Simulate a standard customer JWT token
      const customerPayload = { email: 'customer@rarenuts.com', sub: 'cust-123', role: 'customer' };
      const customerToken = jwtService.sign(customerPayload, { secret: JWT_SECRET });

      // Create a mock ExecutionContext for the guard check
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: `Bearer ${customerToken}` },
          }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(/Insufficient permissions|Forbidden/i);
    });

    it('should allow authorized admin users to activate administrative guards', async () => {
      const adminPayload = { email: 'admin@rarenuts.com', sub: 'admin-123', role: 'admin' };
      const adminToken = jwtService.sign(adminPayload, { secret: JWT_SECRET });

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: `Bearer ${adminToken}` },
          }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      const isAllowed = await guard.canActivate(mockExecutionContext);
      expect(isAllowed).toBe(true);
    });
  });

  describe('JWT Verification Boundaries', () => {
    it('should reject malformed or expired tokens', async () => {
      const invalidToken = 'this.is.not.a.valid.jwt';
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: `Bearer ${invalidToken}` },
          }),
        }),
        getHandler: () => jest.fn(),
        getClass: () => jest.fn(),
      } as any;

      const guard = new AdminAuthGuard(jwtService as any, { getAllAndOverride: () => ['ADMIN'] } as any);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(/Invalid admin token|Unauthorized/i);
    });
  });
});
