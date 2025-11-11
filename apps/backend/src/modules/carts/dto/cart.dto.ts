import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * DTO pour ajouter un produit au panier
 */
export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  selectedVariants?: Record<string, string>; // ex: { color: "Black", size: "L" }
}

/**
 * DTO pour mettre à jour un item du panier
 */
export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsObject()
  selectedVariants?: Record<string, string>;
}


/**
 * DTO pour la suppression d'un item du panier
 */
export class RemoveFromCartDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsObject()
  selectedVariants?: Record<string, string>;
}

/**
 * Sous-classes pour objets imbriqués
 */
export class TranslatableStringDto {
  @IsString()
  fr: string;

  @IsString()
  en: string;
}

export class ColorDto {
  @IsString()
  label: string;

  @IsString()
  code: string;
}

export class PriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string; // ex: "USD"
}

export class PromotionDto {
  @IsNumber()
  @Min(0)
  reduced_price: number;

  @IsNumber()
  @Min(0)
  pourcentage: number;
}

/**
 * DTO principal pour un item du panier
 */
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

/**
 * DTO de réponse pour le panier complet
 */
export class CartResponseDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsNumber()
  totalItems: number;

  @ValidateNested()
  @Type(() => PriceDto)
  subtotal: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  codepromo?: PriceDto;

  // @ValidateNested()
  // @Type(() => PriceDto)
  // shipping: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  total: PriceDto;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
