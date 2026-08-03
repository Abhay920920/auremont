import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Coupon } from '@prisma/client';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupons.dto';

@Injectable()
export class CouponsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async validateCoupon(code: string, subtotal: number): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (!coupon.status) throw new BadRequestException('Coupon is no longer active');

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException('Coupon is expired or not yet active');
    }
    if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) {
      throw new BadRequestException(`Minimum order amount of ₹${coupon.minimumOrder} required`);
    }
    if (coupon.usageLimit !== null) {
      const usageCount = await this.prisma.order.count({ where: { couponId: coupon.id } });
      if (usageCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
    }
    return coupon;
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  async listAll(): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({ orderBy: { endDate: 'desc' } });
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
