import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
