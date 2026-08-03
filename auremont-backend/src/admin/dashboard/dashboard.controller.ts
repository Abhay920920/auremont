import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './dashboard.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('metrics')
  @UseGuards(AdminAuthGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MARKETING_MANAGER')
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }
}
