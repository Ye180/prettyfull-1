import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = ProductSchema & Document;

@Schema({ timestamps: true })
export class ProductSchema {
  @Prop({ type: Object, required: true })
  name: { fr: string; en: string };

  @Prop({ type: Object, required: true })
  description: { fr: string; en: string };

  @Prop({ required: true, unique: true, index: true })
  sku: string;

  @Prop({ type: Object, required: true })
  price: { amount: number; currency: string };

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'CategorySchema',
    required: true,
    index: true,
  })
  category: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [Object], default: [] })
  variants: Array<{ name: string; options: string[] }>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: Object })
  seoMeta?: {
    title?: { fr: string; en: string };
    description?: { fr: string; en: string };
    keywords?: string[];
  };
}

export const ProductSchemaDefinition =
  SchemaFactory.createForClass(ProductSchema);

// Index pour la recherche
ProductSchemaDefinition.index({ name: 'text', description: 'text' });
ProductSchemaDefinition.index({ sku: 1, isActive: 1 });
ProductSchemaDefinition.index({ category: 1, isActive: 1 });
