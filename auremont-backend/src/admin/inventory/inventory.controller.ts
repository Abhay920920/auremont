import { Controller, Get, Param, Query, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminInventoryService } from './inventory.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';

@Controller('admin/inventory')
@UseGuards(AdminAuthGuard)
export class AdminInventoryController {
  constructor(private readonly inventoryService: AdminInventoryService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  @Get(':id/logs')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER')
  getLogs(@Param('id') id: string) {
    return this.inventoryService.getLogs(id);
  }

  @Post(':id/adjust')
  @Roles('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER')
  adjustStock(
    @Param('id') id: string,
    @Body('changeQty') changeQty: number,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    return this.inventoryService.adjustStock(id, changeQty, reason, req.admin.id);
  }
}
