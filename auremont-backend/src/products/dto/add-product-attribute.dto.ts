import { IsString, IsNotEmpty } from 'class-validator';

export class AddProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  attributeName: string;

  @IsString()
  @IsNotEmpty()
  attributeValue: string;
}
