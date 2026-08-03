import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() slug: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() status?: boolean;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
  @IsOptional() @IsString() ogImageUrl?: string;
  @IsOptional() @IsBoolean() isIndexable?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() status?: boolean;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
  @IsOptional() @IsString() ogImageUrl?: string;
  @IsOptional() @IsBoolean() isIndexable?: boolean;
}

export class CreateCollectionDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() slug: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() bannerUrl?: string;
  @IsOptional() @IsBoolean() status?: boolean;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
  @IsOptional() @IsString() ogImageUrl?: string;
  @IsOptional() @IsBoolean() isIndexable?: boolean;
}

export class UpdateCollectionDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() bannerUrl?: string;
  @IsOptional() @IsBoolean() status?: boolean;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
  @IsOptional() @IsString() ogImageUrl?: string;
  @IsOptional() @IsBoolean() isIndexable?: boolean;
}
