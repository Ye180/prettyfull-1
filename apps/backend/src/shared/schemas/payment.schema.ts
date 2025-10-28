import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayementDocument = PaymentSchema & Document;

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class PaymentSchema {
  @Prop({ required: true, unique: true, index: true })
  paymentReference: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'OrderSchema',
    required: true,
    index: true,
  })
  order: Types.ObjectId;

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
    index: true,
  })
  method: PaymentMethod;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    index: true,
  })
  status: PaymentStatus;

  @Prop({ type: Object, required: true })
  amount: { amount: number; currency: string };

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop()
  transactionId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const PaymentSchemaDefinition =
  SchemaFactory.createForClass(PaymentSchema);

// Index pour la recherche
PaymentSchemaDefinition.index({ paymentReference: 1, status: 1 });
PaymentSchemaDefinition.index({ order: 1, status: 1 });
PaymentSchemaDefinition.index({ method: 1, status: 1 });
