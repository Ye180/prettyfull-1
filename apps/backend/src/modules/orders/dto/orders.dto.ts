import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from 'src/modules/address/dto/address.dto';
// --- Sous-DTOs ---

class PriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

// class AddressDto {
//   @IsString()
//   fullName: string;

//   @IsString()
//   street: string;

//   @IsString()
//   city: string;

//   @IsString()
//   postalCode: string;

//   @IsString()
//   country: string;

//   @IsString()
//   @IsOptional()
//   phone?: string;
// }

class PaymentInfoDto {
  @IsString()
  method: string; // ex: "credit_card", "paypal"

  @IsString()
  status: string; // ex: "paid", "pending"

  @IsString()
  @IsOptional()
  transactionId?: string;
}

class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  selectedVariants?: Record<string, string>;

  @ValidateNested()
  @Type(() => PriceDto)
  unitPrice: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  totalPrice: PriceDto;
}

// --- Statuts disponibles ---

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// export enum DeliveryStatus {

// }

// --- DTO principal ---

export class CreateOrderDto {
  @IsString()
  orderNumber: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  billingAddressInfo?: AddressDto;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddressInfo?: AddressDto;

  @ValidateNested()
  @Type(() => PaymentInfoDto)
  payment: PaymentInfoDto;

  @ValidateNested()
  @Type(() => PriceDto)
  subtotal: PriceDto;

  @ValidateNested()
  @Type(() => OrderItemDto)
  selectedVariants: OrderItemDto[];

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  shippingCost?: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  discount?: PriceDto;

  @ValidateNested()
  @Type(() => PriceDto)
  total: PriceDto;

  @IsString()
  currency: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  notes?: string;
}
