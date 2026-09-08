import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  @IsNotEmpty()
  productId: string;
}
