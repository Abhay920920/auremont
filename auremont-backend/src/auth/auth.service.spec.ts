import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaService } from '../prisma/prisma.service.mock';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let prismaMock: any;
  let usersServiceMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    prismaMock = createMockPrismaService();
    usersServiceMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock_token_jwt'),
      verify: jest.fn().mockReturnValue({ sub: 'user-001', email: 'test@auremont.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user object without passwordHash when credentials match', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      const user = { id: 'user-1', email: 'test@auremont.com', passwordHash: hashedPassword, role: 'customer' };
      usersServiceMock.findByEmail.mockResolvedValue(user);

      const result = await authService.validateUser('test@auremont.com', 'secret123');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@auremont.com');
      expect(result.passwordHash).toBeUndefined();
    });

    it('should return null when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      const user = { id: 'user-1', email: 'test@auremont.com', passwordHash: hashedPassword };
      usersServiceMock.findByEmail.mockResolvedValue(user);

      const result = await authService.validateUser('test@auremont.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      const result = await authService.validateUser('nonexistent@auremont.com', 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token and refresh_token', async () => {
      const user = { id: 'user-001', email: 'alexander@auremont.com', role: 'customer' };
      prismaMock._seed('users', [user]);

      const result = await authService.login(user);
      expect(result.access_token).toBe('mock_token_jwt');
      expect(result.refresh_token).toBe('mock_token_jwt');
      expect(result.user).toEqual(user);
    });
  });

  describe('register', () => {
    it('should create user and return login tokens', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);
      const newUser = { id: 'user-new', firstName: 'Alexander', lastName: 'Vance', email: 'new@auremont.com', role: 'customer' };
      usersServiceMock.create.mockResolvedValue(newUser);
      prismaMock._seed('users', [newUser]);

      const result = await authService.register({
        firstName: 'Alexander',
        lastName: 'Vance',
        email: 'new@auremont.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('new@auremont.com');
      expect(result.tokens.access_token).toBeDefined();
    });

    it('should throw ConflictException if email is already registered', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({ id: 'existing-id', email: 'existing@auremont.com' });

      await expect(
        authService.register({
          firstName: 'Duplicate',
          lastName: 'User',
          email: 'existing@auremont.com',
          password: 'pass',
        })
      ).rejects.toThrow(ConflictException);
    });
  });
});
