import { IsString, IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';

export class AddCartItemDto {
  @IsOptional()
  @IsString()
  cartId?: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
