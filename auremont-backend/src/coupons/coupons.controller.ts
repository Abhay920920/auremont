import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupons.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // ── PUBLIC ─────────────────────────────────────────────────────────────────

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseGuards(OptionalJwtAuthGuard)
  async validateCoupon(@Body() body: ValidateCouponDto, @GetUser() user?: any) {
    const coupon = await this.couponsService.validateCoupon(body.code, body.subtotal, user?.id);
    return {
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount,
      },
    };
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async listAll() {
    return this.couponsService.listAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCoupon(@Body() dto: CreateCouponDto, @GetUser() user: any) {
    return this.couponsService.createCoupon(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCoupon(@Param('id') id: string, @Body() dto: UpdateCouponDto, @GetUser() user: any) {
    return this.couponsService.updateCoupon(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCoupon(@Param('id') id: string, @GetUser() user: any) {
    return this.couponsService.deleteCoupon(id, user.id);
  }
}
