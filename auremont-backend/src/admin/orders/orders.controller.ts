import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AdminOrdersService } from './orders.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';
import { OrderStatus, PayStatus } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(AdminAuthGuard)
export class AdminOrdersController {
  constructor(private readonly ordersService: AdminOrdersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      status,
    );
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Request() req: any,
  ) {
    const adminId = req.admin?.sub || req.admin?.id;
    return this.ordersService.updateOrderStatus(id, status, adminId);
  }

  @Patch(':id/payment')
  @Roles('SUPER_ADMIN', 'ADMIN')
  updatePayment(
    @Param('id') id: string,
    @Body('status') status: PayStatus,
    @Request() req: any,
  ) {
    const adminId = req.admin?.sub || req.admin?.id;
    return this.ordersService.updatePaymentStatus(id, status, adminId);
  }
}
