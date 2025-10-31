import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// --- Sous-classes pour les objets imbriqués ---

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

class PriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

class PromotionDto {
  @IsNumber()
  reduced_price: number;

  @IsNumber()
  pourcentage: number;
}

// --- Variantes produit ---

class VariableProductDto {
  @ValidateNested()
  @Type(() => ColorDto)
  color: ColorDto;

  @IsArray()
  @IsString({ each: true })
  size: string[];

  @IsArray()
  @IsString({ each: true })
  image: string[];

  @IsNumber()
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

  @IsArray()
  @IsString({ each: true })
  image: string[];

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
  keywords: string[];
}

// --- DTO principal ---

export class CreateProductDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  name: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  description: TranslatableStringDto;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariableProductDto)
  @IsOptional()
  variable?: VariableProductDto[];

  @ValidateNested()
  @Type(() => NotVariableProductDto)
  @IsOptional()
  notVariable?: NotVariableProductDto;

  @IsString()
  @IsOptional()
  smallDescription?: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  sku: string;

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

  @IsString()
  @IsOptional()
  label?: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isFeatured: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional() // Stock maintenant optionnel car calculé automatiquement
  stock?: number;

  @ValidateNested()
  @Type(() => SeoMetaDto)
  seoMeta: SeoMetaDto;
}
