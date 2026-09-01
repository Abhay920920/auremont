import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AdminOperationsService } from './operations.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';

@Controller('admin/operations')
@UseGuards(AdminAuthGuard)
export class AdminOperationsController {
  constructor(private readonly operationsService: AdminOperationsService) {}



  @Get('audit-logs')
  @Roles('SUPER_ADMIN')
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.operationsService.getAuditLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
