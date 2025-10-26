import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import type { I18nString } from '../../../shared/schemas/i18n.schema';
import { I18nStringSchema } from '../../../shared/schemas/i18n.schema';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: I18nStringSchema, required: true })
  name: I18nString;

  @Prop({ type: I18nStringSchema })
  description?: I18nString;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: String })
  icon?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parent?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Number, default: 0 })
  productCount: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;

  @Prop({ type: Object })
  seoMeta?: {
    title?: I18nString;
    description?: I18nString;
    keywords?: string[];
  };
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Index pour les performances
// Note: slug index is automatically created by unique: true
CategorySchema.index({ parent: 1, sortOrder: 1 });
CategorySchema.index({ isActive: 1, isVisible: 1 });
