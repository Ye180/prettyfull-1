import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = OrderSchema & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class OrderSchema {
  @Prop({ required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({ type: [Object], required: true })
  items: Array<{
    product: Types.ObjectId;
    sku: string;
    name: { fr: string; en: string };
    quantity: number;
    unitPrice: { amount: number; currency: string };
    totalPrice: { amount: number; currency: string };
    selectedVariants?: Record<string, string>;
  }>;

  @Prop({ type: Object, required: true })
  subtotal: { amount: number; currency: string };

  @Prop({ type: Object, required: true })
  shippingCost: { amount: number; currency: string };

  @Prop({ type: Object, required: true })
  tax: { amount: number; currency: string };

  @Prop({ type: Object, required: true })
  total: { amount: number; currency: string };

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    index: true,
  })
  paymentStatus: PaymentStatus;

  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @Prop({ type: Object, required: true })
  billingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @Prop({ type: [Object], default: [] })
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    comment?: string;
    updatedBy?: string;
  }>;

  @Prop()
  notes?: string;
}

export const OrderSchemaDefinition = SchemaFactory.createForClass(OrderSchema);

// Index
OrderSchemaDefinition.index({ orderNumber: 1 });
OrderSchemaDefinition.index({ user: 1, createdAt: -1 });
OrderSchemaDefinition.index({ status: 1, createdAt: -1 });
