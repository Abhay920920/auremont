import { IsUUID, IsNotEmpty } from 'class-validator';

export class MergeCartDto {
  @IsUUID()
  @IsNotEmpty()
  guestCartId: string;
}
