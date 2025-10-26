/**
 * DTO pour ajouter un produit au panier
 */
export class AddToCartDto {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO pour mettre à jour un item du panier
 */
export class UpdateCartItemDto {
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO pour un item du panier
//  */
export class CartItemGoogDto {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO de réponse pour le panier
 */
export class CartResponseDto {
  userId: string;
  items: CartItemGoogDto[];
  totalItems: number;
  updatedAt: Date;
}

/**
 * DTO pour la suppression d'un item du panier
 */
export class RemoveFromCartDto {
  selectedVariants?: Record<string, string>;
}

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// --- Sous-classes pour objets imbriqués ---

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

// --- DTO principal pour un produit dans le panier ---

export class CartItemDto {
  @IsString()
  productId: string;

  @IsString()
  sku: string;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  name: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  description?: TranslatableStringDto;

  @ValidateNested()
  @Type(() => ColorDto)
  @IsOptional()
  color?: ColorDto;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @ValidateNested()
  @Type(() => PriceDto)
  unitPrice: PriceDto;

  @ValidateNested()
  @Type(() => PromotionDto)
  @IsOptional()
  promotion?: PromotionDto;

  @ValidateNested()
  @Type(() => PriceDto)
  totalPrice: PriceDto;

  @IsBoolean()
  isActive: boolean;
}
