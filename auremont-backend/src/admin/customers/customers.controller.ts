import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { AdminCustomersService } from './customers.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';
import { UserStatus } from '@prisma/client';

@Controller('admin/customers')
@UseGuards(AdminAuthGuard)
export class AdminCustomersController {
  constructor(private readonly customersService: AdminCustomersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const cleanSearch = typeof search === 'string' ? search.trim() : undefined;
    return this.customersService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      cleanSearch,
    );
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status') status: UserStatus,
    @Request() req: any,
  ) {
    return this.customersService.updateStatus(id, status, req.admin.id);
  }
}
