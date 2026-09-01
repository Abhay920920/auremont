import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @IsString()
  @IsOptional()
  ogImageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  focusKeyword?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  authorName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  authorRole?: string;

  @IsBoolean()
  @IsOptional()
  isIndexable?: boolean;
}

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @IsString()
  @IsOptional()
  ogImageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  focusKeyword?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  authorName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  authorRole?: string;

  @IsBoolean()
  @IsOptional()
  isIndexable?: boolean;
}
