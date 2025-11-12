import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AddressDto } from 'src/modules/address/dto/address.dto';

// --- Sous-schémas réutilisables ---

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class Price {
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true })
  currency: string;
}
const PriceSchema = SchemaFactory.createForClass(Price);

class I18nString {
  @Prop({ type: String, required: true })
  fr: string;

  @Prop({ type: String, required: true })
  en: string;
}

@Schema({ _id: false })
class PaymentInfo {
  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String })
  transactionId?: string;
}
const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId; // Renommé de productId à product pour correspondre à l'usage

  @Prop({ type: String, required: true })
  sku: string;

  @Prop({ type: I18nString, required: true })
  name: I18nString;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: PriceSchema, required: true })
  unitPrice: Price;

  @Prop({ type: PriceSchema, required: true })
  totalPrice: Price;

  @Prop({ type: Object })
  selectedVariants?: Record<string, string>; // Ajout du champ pour stocker les variants (couleur, taille, etc.)
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// --- Schéma principal ---

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: String, required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  billingAddress: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: false })
  shippingAddress: Types.ObjectId;

  @Prop({ type: AddressDto })
  shippingAddressInfo: AddressDto;

  @Prop({ type: PaymentInfoSchema, required: false })
  payment: PaymentInfo;

  @Prop({ type: PriceSchema, required: true })
  subtotal: Price;

  @Prop({ type: PriceSchema })
  shippingCost?: Price;

  @Prop({ type: PriceSchema })
  discount?: Price;

  @Prop({ type: PriceSchema, required: true })
  total: Price;

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // Delivery fields (Module 4)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  driverId?: Types.ObjectId;

  @Prop({ type: String, length: 6, uppercase: true })
  validationCode?: string;

  @Prop({ type: Date })
  estimatedDelivery?: Date;

  @Prop({ type: Date })
  assignedAt?: Date;

  @Prop({ type: String })
  deliveryNote?: string;

  @Prop({ type: String })
  signatureUrl?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
