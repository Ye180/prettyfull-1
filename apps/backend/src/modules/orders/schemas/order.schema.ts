// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import type { Price } from '../../../shared/schemas/i18n.schema';
// import { PriceSchema } from '../../../shared/schemas/i18n.schema';

// export type OrderDocument = Order & Document;

// export enum OrderStatus {
//   PENDING = 'pending',
//   CONFIRMED = 'confirmed',
//   PROCESSING = 'processing',
//   SHIPPED = 'shipped',
//   DELIVERED = 'delivered',
//   CANCELLED = 'cancelled',
//   REFUNDED = 'refunded',
// }

// export enum PaymentStatus {
//   PENDING = 'pending',
//   PAID = 'paid',
//   FAILED = 'failed',
//   REFUNDED = 'refunded',
// }

// export enum PaymentMethod {
//   CASH_ON_DELIVERY = 'cash_on_delivery',
//   BANK_TRANSFER = 'bank_transfer',
//   MOBILE_MONEY = 'mobile_money',
//   CREDIT_CARD = 'credit_card',
// }

// // Sous-schéma pour les articles de commande
// @Schema({ _id: false })
// export class OrderItem {
//   @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
//   product: Types.ObjectId;

//   @Prop({ required: true })
//   productName: string; // Nom du produit au moment de la commande

//   @Prop({ required: true })
//   sku: string;

//   @Prop({ type: PriceSchema, required: true })
//   unitPrice: Price; // Prix unitaire au moment de la commande

//   @Prop({ required: true, min: 1 })
//   quantity: number;

//   @Prop({ type: PriceSchema, required: true })
//   totalPrice: Price; // Prix total pour cet article

//   @Prop({ type: Object })
//   selectedVariants?: Record<string, string>; // Variantes sélectionnées
// }

// const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// @Schema({ timestamps: true })
// export class Order {
//   @Prop({ required: true, unique: true })
//   orderNumber: string; // Format: ORD-YYYYMMDD-XXXX

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   user: Types.ObjectId;

//   @Prop({ type: [OrderItemSchema], required: true })
//   items: OrderItem[];

//   @Prop({ type: PriceSchema, required: true })
//   subtotal: Price; // Sous-total des articles

//   @Prop({ type: PriceSchema, default: { amount: 0, currency: 'XOF' } })
//   shippingCost: Price;

//   @Prop({ type: PriceSchema, default: { amount: 0, currency: 'XOF' } })
//   taxAmount: Price;

//   @Prop({ type: PriceSchema, default: { amount: 0, currency: 'XOF' } })
//   discountAmount: Price;

//   @Prop({ type: PriceSchema, required: true })
//   totalAmount: Price; // Montant total final

//   @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
//   status: OrderStatus;

//   @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
//   paymentStatus: PaymentStatus;

//   @Prop({ type: String, enum: PaymentMethod, required: true })
//   paymentMethod: PaymentMethod;

//   @Prop({
//     type: {
//       firstName: { type: String, required: true },
//       lastName: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, required: true },
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: String,
//       country: { type: String, required: true },
//     },
//     required: true,
//   })
//   shippingAddress: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     street: string;
//     city: string;
//     postalCode?: string;
//     country: string;
//   };

//   @Prop({
//     type: {
//       firstName: { type: String, required: true },
//       lastName: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, required: true },
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: String,
//       country: { type: String, required: true },
//     },
//   })
//   billingAddress?: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     street: string;
//     city: string;
//     postalCode?: string;
//     country: string;
//   };

//   @Prop({ type: String })
//   notes?: string; // Notes du client

//   @Prop({ type: String })
//   trackingNumber?: string;

//   @Prop({ type: Date })
//   shippedAt?: Date;

//   @Prop({ type: Date })
//   deliveredAt?: Date;

//   @Prop({
//     type: [{ message: String, timestamp: { type: Date, default: Date.now } }],
//   })
//   statusHistory: Array<{
//     message: string;
//     timestamp: Date;
//   }>;
// }

// export const OrderSchema = SchemaFactory.createForClass(Order);

// // Index pour les performances
// OrderSchema.index({ user: 1, createdAt: -1 });
// // Note: orderNumber index is automatically created by unique: true
// OrderSchema.index({ status: 1 });
// OrderSchema.index({ paymentStatus: 1 });
