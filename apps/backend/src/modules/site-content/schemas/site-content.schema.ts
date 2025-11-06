import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteContentDocument = SiteContent & Document;

export enum ContentType {
  SECTION = 'section',
  BANNER = 'banner',
  CATEGORY = 'category',
}

export class I18nString {
  fr?: string;
  en?: string;
}

@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true })
  key: string; // Exemple: "home-first-section"

  @Prop({ type: String, ref: 'Category', required: true })
  category: string;

  @Prop({ type: String, enum: ContentType, required: true })
  type: ContentType;

  @Prop({ type: Object, required: true })
  content: {
    title?: I18nString;
    subtitle?: I18nString;
    description?: I18nString;
    image_desktop?: string;
    image_mobile?: string;
    video?: string;
    paragraphe?: string;
    textbutton?: I18nString;
    categoryButton?: I18nString;
    categorie?: string | Array<any>;
    products?: Array<{
      id?: number;
      name?: string;
      price?: number;
      imageUrl?: string;
    }>;
    images?: string[];
    categories?: string[] | Array<{ name: I18nString; slug: string }>;
    [key: string]: any;
  };

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: Date })
  expiresAt?: Date;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
