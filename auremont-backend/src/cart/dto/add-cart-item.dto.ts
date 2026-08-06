import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class AddCartItemDto {
  @IsOptional()
  @IsString()
  cartId?: string;

  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
