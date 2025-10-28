import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// --- Sous-schémas réutilisables ---

@Schema({ _id: false })
class I18nString {
  @Prop({ type: String, required: true })
  fr: string;

  @Prop({ type: String, required: true })
  en: string;
}
const I18nStringSchema = SchemaFactory.createForClass(I18nString);

@Schema({ _id: false })
class Color {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: true })
  code: string;
}
const ColorSchema = SchemaFactory.createForClass(Color);

@Schema({ _id: false })
class Price {
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true })
  currency: string;
}
const PriceSchema = SchemaFactory.createForClass(Price);

@Schema({ _id: false })
class Promotion {
  @Prop({ type: Number, required: true })
  reduced_price: number;

  @Prop({ type: Number, required: true })
  pourcentage: number;
}
const PromotionSchema = SchemaFactory.createForClass(Promotion);

// --- Item du panier ---

@Schema({ _id: false })
class CartItem {
  @Prop({ type: String, required: true })
  productId: string;

  @Prop({ type: String, required: true })
  sku: string;

  @Prop({ type: I18nStringSchema, required: true })
  name: I18nString;

  @Prop({ type: I18nStringSchema })
  description?: I18nString;

  @Prop({ type: ColorSchema })
  color?: Color;

  @Prop({ type: String })
  size?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: PriceSchema, required: true })
  unitPrice: Price;

  @Prop({ type: PromotionSchema })
  promotion?: Promotion;

  @Prop({ type: PriceSchema, required: true })
  totalPrice: Price;

  @Prop({ type: Boolean, required: true })
  isActive: boolean;
}
const CartItemSchema = SchemaFactory.createForClass(CartItem);

// --- Schéma principal du panier ---

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ type: PriceSchema, required: true })
  total: Price;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
