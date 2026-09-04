import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ── PUBLIC / USER ──────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Body() data: CreateReviewDto, @GetUser() user: any) {
    return this.reviewsService.createReview({ ...data, userId: user.id });
  }

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserReviews(@Param('userId') userId: string, @GetUser() user: any) {
    if (user.id !== userId && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to view these reviews');
    }
    return this.reviewsService.getUserReviews(userId);
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllReviews(@Query('status') status?: string) {
    return this.reviewsService.getAllReviews(status);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async moderateReview(@Param('id') id: string, @Body() dto: ModerateReviewDto, @GetUser() user: any) {
    return this.reviewsService.moderateReview(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteReview(@Param('id') id: string, @GetUser() user: any) {
    return this.reviewsService.deleteReview(id, user.id);
  }
}
