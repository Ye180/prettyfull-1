import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import type { I18nString, Price } from '../../../shared/schemas/i18n.schema';
import {
  I18nStringSchema,
  PriceSchema,
} from '../../../shared/schemas/i18n.schema';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ type: I18nStringSchema, required: true })
  name: I18nString;

  @Prop({ type: I18nStringSchema, required: true })
  description: I18nString;

  @Prop({ type: I18nStringSchema })
  shortDescription?: I18nString;

  @Prop({ type: PriceSchema, required: true })
  price: Price;

  @Prop({ type: PriceSchema })
  compareAtPrice?: Price; // Prix barré

  @Prop({ type: Number, required: true, min: 0 })
  stock: number;

  @Prop({ type: Number, min: 0 })
  minimumStock?: number; // Seuil d'alerte stock

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: String })
  thumbnail?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({
    type: [
      {
        name: { type: I18nStringSchema, required: true },
        values: [{ type: I18nStringSchema, required: true }],
      },
    ],
  })
  variants?: Array<{
    name: I18nString;
    values: I18nString[];
  }>;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  reviewsCount: number;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;

  @Prop({ type: Number, default: 0 })
  weight?: number; // En grammes

  @Prop({
    type: {
      length: Number,
      width: Number,
      height: Number,
    },
  })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Prop({ type: Object })
  seoMeta?: {
    title?: I18nString;
    description?: I18nString;
    keywords?: string[];
  };

  @Prop({ type: Number, default: 0 })
  salesCount: number; // Compteur de ventes
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Index pour la recherche
ProductSchema.index({
  'name.fr': 'text',
  'name.en': 'text',
  'description.fr': 'text',
  'description.en': 'text',
  tags: 'text',
});

// Index pour les performances
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ status: 1, isFeatured: -1 });
ProductSchema.index({ 'price.amount': 1 });
