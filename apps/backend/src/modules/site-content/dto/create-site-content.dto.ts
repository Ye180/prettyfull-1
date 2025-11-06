import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ContentType {
  SECTION = 'section',
  BANNER = 'banner',
  CATEGORY = 'category',
}

export class I18nString {
  @ApiPropertyOptional({ example: 'Découvrez la beauté naturelle' })
  @IsOptional()
  @IsString()
  fr?: string;

  @ApiPropertyOptional({ example: 'Discover natural beauty' })
  @IsOptional()
  @IsString()
  en?: string;
}

export class ProductContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CategoryContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  name?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class SiteContentDto {
  @ApiPropertyOptional({
    example: 'https://cdn.prettyfull.shop/images/hero-desktop.jpg',
  })
  @IsOptional()
  @IsString()
  image_desktop?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  title?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  subtitle?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  description?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  paragraphe?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  textbutton?: I18nString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  categoryButton?: I18nString;

  @ApiPropertyOptional({ type: [ProductContentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => ProductContentDto)
  products?: ProductContentDto[];

  @ApiPropertyOptional({ type: [CategoryContentDto] })
  @IsOptional()
  @IsArray()
  @Type(() => CategoryContentDto)
  categories?: CategoryContentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorie?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  devise?: string;

  @ApiPropertyOptional({ example: { customField: 'valeur libre' } })
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;
}

export class CreateSiteContentDto {
  @ApiProperty({ example: '68fe98d69e21f9f242e9d61c' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'home-first-section' })
  @IsString()
  key: string;

  @ApiProperty({ enum: ContentType, example: ContentType.SECTION })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({ type: SiteContentDto })
  @IsObject()
  @Type(() => SiteContentDto)
  content: SiteContentDto;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: '2025-11-06T10:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}
