import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';

@Controller('admin/products')
@UseGuards(AdminAuthGuard)
export class AdminProductsController {
  constructor(private readonly productsService: AdminProductsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER', 'MARKETING_MANAGER')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    return this.productsService.findAll(skip, Number(limit), search);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'INVENTORY_MANAGER')
  async create(@Body() data: any, @Req() req: any) {
    // The admin's ID is injected into req.admin by the AdminAuthGuard
    // Using a dummy ID for testing if not fully hooked up
    const adminId = req.admin?.sub || '00000000-0000-0000-0000-000000000000';
    return this.productsService.create(data, adminId);
  }
}
