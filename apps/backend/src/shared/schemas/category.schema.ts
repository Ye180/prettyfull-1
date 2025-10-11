import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = CategorySchema & Document;

@Schema({ timestamps: true })
export class CategorySchema {
  @Prop({ type: Object, required: true })
  name: { fr: string; en: string };

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ type: Object, required: true })
  description: { fr: string; en: string };

  @Prop({
    type: Types.ObjectId,
    ref: 'CategorySchema',
    default: null,
    index: true,
  })
  parent: Types.ObjectId | null;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ type: Object })
  seoMeta?: {
    title?: { fr: string; en: string };
    description?: { fr: string; en: string };
    keywords?: string[];
  };
}

export const CategorySchemaDefinition =
  SchemaFactory.createForClass(CategorySchema);

// Index
CategorySchemaDefinition.index({ slug: 1, isActive: 1 });
CategorySchemaDefinition.index({ parent: 1, isActive: 1 });
