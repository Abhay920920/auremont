import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Review } from '@prisma/client';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private inflight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCache(key: string, data: any) {
    if (this.cache.size > 200) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  clearCache() {
    this.cache.clear();
    this.inflight.clear();
  }

  async createReview(data: {
    userId: string;
    productId: string;
    rating: number;
    title?: string;
    review?: string;
  }): Promise<Review> {
    this.clearCache();
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        review: data.review,
        status: 'approved',
      },
    });
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    const cacheKey = `reviews:product:${productId}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;
    if (this.inflight.has(cacheKey)) return this.inflight.get(cacheKey);

    const fetchPromise = (async () => {
      const reviews = await this.prisma.review.findMany({
        where: { 
          productId,
          status: 'approved',
        },
        include: {
          user: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' },
      });
      this.setCache(cacheKey, reviews);
      return reviews;
    })().finally(() => {
      this.inflight.delete(cacheKey);
    });

    this.inflight.set(cacheKey, fetchPromise);
    return fetchPromise;
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
