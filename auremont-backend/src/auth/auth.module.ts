import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

import { MailService } from './mail.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, MailService, JwtStrategy, RolesGuard, Reflector],
  controllers: [AuthController],
  exports: [AuthService, MailService, JwtStrategy, RolesGuard, JwtModule, Reflector],
})
export class AuthModule {}

