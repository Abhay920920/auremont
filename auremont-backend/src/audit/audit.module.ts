import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [],
  controllers: [AuditController],
  providers: [AuditService, RolesGuard, Reflector],
  exports: [AuditService],
})
export class AuditModule {}

