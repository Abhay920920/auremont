import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AdminReviewsService } from './reviews.service';
import { AdminAuthGuard, Roles } from '../auth/admin-auth.guard';
import { ReviewStatus } from '@prisma/client';

@Controller('admin/reviews')
@UseGuards(AdminAuthGuard)
export class AdminReviewsController {
  constructor(private readonly reviewsService: AdminReviewsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'MARKETING_MANAGER')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ReviewStatus,
  ) {
    return this.reviewsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      status,
    );
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReviewStatus,
    @Request() req: any,
  ) {
    return this.reviewsService.updateStatus(id, status, req.admin.id);
  }
}
