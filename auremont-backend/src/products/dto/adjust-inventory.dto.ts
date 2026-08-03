import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustInventoryDto {
  @IsInt()
  @Type(() => Number)
  changeQty: number;  // positive = stock in, negative = manual deduction

  @IsString()
  @IsNotEmpty()
  reason: string;
}
