import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Review } from '@prisma/client';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async createReview(data: {
    userId: string;
    productId: string;
    rating: number;
    title?: string;
    review?: string;
  }): Promise<Review> {
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        review: data.review,
        status: 'pending',
      },
    });
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { 
        productId,
        status: 'approved',
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        product: { select: { name: true, thumbnailUrl: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async getAllReviews(status?: string): Promise<Review[]> {
    const where = status ? { status: status as any } : {};
    return this.prisma.review.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async moderateReview(id: string, dto: ModerateReviewDto, adminId: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { status: dto.status }
    });

    await this.audit.log({ userId: adminId, action: 'MODERATE_REVIEW', entity: 'Review', entityId: id });
    return updated;
  }
}
