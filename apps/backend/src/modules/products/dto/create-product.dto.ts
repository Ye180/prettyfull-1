import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class TranslatableStringDto {
  @IsString()
  fr: string;

  @IsString()
  en: string;
}

class PriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

class ProductVariantDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  name: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  description: TranslatableStringDto;

  @IsString()
  sku: string;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsMongoId()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variants?: ProductVariantDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsObject()
  @IsOptional()
  seoMeta?: {
    title?: { fr: string; en: string };
    description?: { fr: string; en: string };
    keywords?: string[];
  };
}
