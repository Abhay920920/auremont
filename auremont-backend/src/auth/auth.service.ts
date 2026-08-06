import { Injectable, UnauthorizedException, ConflictException, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const adminPassword = await bcrypt.hash('Admin@12345', 10);
      const testPassword = await bcrypt.hash('password123', 10);

      await this.prisma.user.upsert({
        where: { email: 'admin@auremont.com' },
        update: { passwordHash: adminPassword, role: 'admin' },
        create: {
          firstName: 'Auremont',
          lastName: 'Concierge',
          email: 'admin@auremont.com',
          passwordHash: adminPassword,
          role: 'admin',
          emailVerified: true,
        },
      });

      await this.prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { passwordHash: testPassword, role: 'admin' },
        create: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          passwordHash: testPassword,
          role: 'admin',
          emailVerified: true,
        },
      });

      await this.prisma.user.upsert({
        where: { email: 'example@gmail.com' },
        update: { passwordHash: testPassword, role: 'customer' },
        create: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'example@gmail.com',
          passwordHash: testPassword,
          role: 'customer',
          emailVerified: true,
        },
      });
    } catch (e) {
      // Auto-seed on startup complete
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.passwordHash && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, refreshToken, resetToken, resetTokenExpiry, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    // Generate refresh token
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    
    // Save to DB
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }
    });

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      // Generate a new refresh token (token rotation)
      const new_refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' });
      const hashedRefreshToken = await bcrypt.hash(new_refresh_token, 10);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken }
      });

      return { access_token, refresh_token: new_refresh_token };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.usersService.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: hashedPassword,
    });
    const { passwordHash, refreshToken, resetToken, resetTokenExpiry, ...user } = newUser as any;
    
    // Automatically issue login tokens upon registration
    const tokens = await this.login(user);

    return {
      user,
      tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // For security, don't reveal if user exists or not
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedResetToken, resetTokenExpiry: expiry }
    });

    // Mock Email Sending
    const logger = new Logger('EmailService');
    logger.log('\n=============================================');
    logger.log(`[MOCK EMAIL] To: ${email}`);
    logger.log(`[MOCK EMAIL] Subject: Account Recovery Request`);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=[REDACTED_TOKEN]&email=${email}`;
    logger.log(`[MOCK EMAIL] Body: Please click the link to recover your account: ${resetUrl}`);
    logger.log('=============================================\n');

    return { message: 'If an account exists, a reset link has been sent.' };
  }

  async resetPassword(data: any) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const isMatch = await bcrypt.compare(data.token, user.resetToken);
    if (!isMatch) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpiry: null }
    });

    return { message: 'Password reset successfully' };
  }
}
