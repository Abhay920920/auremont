import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum CouponType {
  flat = 'flat',
  percentage = 'percentage',
}

export class CreateCouponDto {
  @IsString() @IsNotEmpty() code!: string;

  @IsEnum(CouponType) type!: CouponType;

  @IsNumber() @Min(0) @Type(() => Number) value!: number;

  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minimumOrder?: number;

  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) maxDiscount?: number;

  @IsDateString() startDate!: string;

  @IsDateString() endDate!: string;

  @IsOptional() @IsInt() @Min(1) @Type(() => Number) usageLimit?: number;

  @IsOptional() @IsBoolean() status?: boolean;
}

export class UpdateCouponDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsEnum(CouponType) type?: CouponType;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) value?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minimumOrder?: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) maxDiscount?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) usageLimit?: number;
  @IsOptional() @IsBoolean() status?: boolean;
}
