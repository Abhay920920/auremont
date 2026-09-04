import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Coupon } from '@prisma/client';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupons.dto';

@Injectable()
export class CouponsService {
  private couponCache = new Map<string, { data: Coupon; expiresAt: number }>();
  private usageCountCache = new Map<string, { count: number; expiresAt: number }>();
  private inflight = new Map<string, Promise<any>>();
  private readonly CACHE_TTL_MS = 30_000; // 30s

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async validateCoupon(code: string, subtotal: number, userId?: string): Promise<Coupon> {
    // Cache-and-single-flight for coupon lookup to prevent DB stampede under 500+ concurrent validations
    const now = Date.now();
    const cacheKey = `coupon:${code}`;

    let coupon: Coupon | null = null;
    const cached = this.couponCache.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      coupon = cached.data;
    } else if (this.inflight.has(cacheKey)) {
      coupon = await this.inflight.get(cacheKey);
    } else {
      const fetchPromise = this.prisma.coupon.findUnique({ where: { code } }).then(c => {
        if (c) this.couponCache.set(cacheKey, { data: c, expiresAt: now + this.CACHE_TTL_MS });
        this.inflight.delete(cacheKey);
        return c;
      });
      this.inflight.set(cacheKey, fetchPromise);
      coupon = await fetchPromise;
    }

    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (!coupon.status) throw new BadRequestException('Coupon is no longer active');

    const nowDate = new Date();
    if (nowDate < coupon.startDate || nowDate > coupon.endDate) {
      throw new BadRequestException('Coupon is expired or not yet active');
    }
    if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) {
      throw new BadRequestException(`Minimum order amount of ₹${coupon.minimumOrder} required`);
    }

    if (coupon.usageLimit !== null) {
      // Cache usage count to prevent N concurrent DB reads for the same coupon
      const usageKey = `usage:${coupon.id}`;
      const cachedUsage = this.usageCountCache.get(usageKey);
      let usageCount: number;
      if (cachedUsage && now < cachedUsage.expiresAt) {
        usageCount = cachedUsage.count;
      } else {
        usageCount = await this.prisma.order.count({ where: { couponId: coupon.id } });
        this.usageCountCache.set(usageKey, { count: usageCount, expiresAt: now + this.CACHE_TTL_MS });
      }
      if (usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
    }

    // Per-user abuse prevention: always live-check (cannot cache per-user safely)
    if (userId) {
      const userUsage = await this.prisma.order.count({
        where: { couponId: coupon.id, userId },
      });
      if (userUsage > 0) {
        throw new BadRequestException('You have already used this coupon');
      }
    }
    return coupon;
  }

  private listAllCache: { data: Coupon[]; expiresAt: number } | null = null;
  private inFlightListAll: Promise<Coupon[]> | null = null;

  // Invalidate caches when a coupon is modified (admin operations)
  private invalidateCouponCache(code?: string, id?: string) {
    this.listAllCache = null;
    this.inFlightListAll = null;
    if (code) this.couponCache.delete(`coupon:${code}`);
    if (id) this.usageCountCache.delete(`usage:${id}`);
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async listAll(): Promise<Coupon[]> {
    const now = Date.now();
    if (this.listAllCache && now < this.listAllCache.expiresAt) {
      return this.listAllCache.data;
    }
    if (this.inFlightListAll) {
      return this.inFlightListAll;
    }

    this.inFlightListAll = (async () => {
      const list = await this.prisma.coupon.findMany({ orderBy: { endDate: 'desc' } });
      this.listAllCache = { data: list, expiresAt: Date.now() + this.CACHE_TTL_MS };
      return list;
    })().finally(() => {
      this.inFlightListAll = null;
    });

    return this.inFlightListAll;
  }

  async findOne(id: string): Promise<Coupon> {
    return this.findOrThrow(id);
  }

  async createCoupon(dto: CreateCouponDto, adminId: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
    await this.audit.log({ userId: adminId, action: 'CREATE_COUPON', entity: 'Coupon', entityId: coupon.id });
    return coupon;
  }

  async updateCoupon(id: string, dto: UpdateCouponDto, adminId: string): Promise<Coupon> {
    await this.findOrThrow(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    const coupon = await this.prisma.coupon.update({ where: { id }, data });
    await this.audit.log({ userId: adminId, action: 'UPDATE_COUPON', entity: 'Coupon', entityId: id });
    return coupon;
  }

  async deleteCoupon(id: string, adminId: string) {
    await this.findOrThrow(id);
    await this.prisma.coupon.delete({ where: { id } });
    await this.audit.log({ userId: adminId, action: 'DELETE_COUPON', entity: 'Coupon', entityId: id });
    return { success: true };
  }

  private async findOrThrow(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }
}
