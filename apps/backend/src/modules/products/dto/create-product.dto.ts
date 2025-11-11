import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// --- Sous-classes ---

class TranslatableStringDto {
  @IsString()
  fr: string;

  @IsString()
  en: string;
}

class ColorDto {
  @IsString()
  label: string;

  @IsString()
  code: string;
}

class TranslatablePriceDto {
  @IsNumber()
  @Min(0)
  fr: number;

  @IsNumber()
  @Min(0)
  en: number;
}

class PriceDto {
  @ValidateNested()
  @Type(() => TranslatablePriceDto)
  amount: TranslatablePriceDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  currency: TranslatableStringDto;
}

class PromotionDto {
  @ValidateNested()
  @Type(() => TranslatablePriceDto)
  reduced_price: TranslatablePriceDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  pourcentage: number;
}

// --- Variantes produit ---

export class VariantsProductDto {
  @IsOptional()
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => ColorDto)
  color: ColorDto;

  @IsArray()
  @IsString({ each: true })
  size: string[];

  @IsOptional()
  images: any[];

  @IsNumber()
  @Min(0)
  quantity: number;
}

class NotVariableProductDto {
  @ValidateNested()
  @Type(() => ColorDto)
  @IsOptional()
  color?: ColorDto;

  @IsArray()
  @IsString({ each: true })
  size: string[];

  // store filenames / URLs after binding
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

  @IsNumber()
  @IsOptional()
  quantity?: number;
}

class SeoMetaDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  description: TranslatableStringDto;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keywords: string[];
}

// --- DTO principal ---

export class CreateProductDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  name: TranslatableStringDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  description: TranslatableStringDto;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantsProductDto)
  @IsOptional()
  variants?: VariantsProductDto[];

  @ValidateNested()
  @Type(() => NotVariableProductDto)
  @IsOptional()
  notVariable?: NotVariableProductDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  smallDescription?: TranslatableStringDto;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  sku: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsBoolean()
  @IsOptional()
  solde?: boolean;

  @ValidateNested()
  @Type(() => PromotionDto)
  @IsOptional()
  promotion?: PromotionDto;

  @IsBoolean()
  @IsOptional()
  isLoading?: boolean;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  label?: TranslatableStringDto;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isFeatured: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta: SeoMetaDto;
}
