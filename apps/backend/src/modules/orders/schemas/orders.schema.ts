import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  productId: Types.ObjectId;

  variant: string;

  taille: string[];

  @Prop({ type: String, required: true })
  sku: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: PriceSchema, required: true })
  unitPrice: Price;

  @Prop({ type: PriceSchema, required: true })
  totalPrice: Price;
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

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  shippingAddress: Types.ObjectId;

  @Prop({ type: PaymentInfoSchema, required: true })
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
}

export const OrderSchema = SchemaFactory.createForClass(Order);
