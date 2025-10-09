import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { I18nString } from '../../../shared/schemas/i18n.schema';

export type SiteContentDocument = SiteContent & Document;

export enum ContentType {
  HERO_BANNER = 'hero_banner',
  PROMO_BANNER = 'promo_banner',
  TEXT_BLOCK = 'text_block',
  IMAGE_GALLERY = 'image_gallery',
  FAQ = 'faq',
  TERMS = 'terms',
  PRIVACY = 'privacy',
}

@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true })
  key: string; // Identifiant unique (ex: home-hero-banner)

  @Prop({ type: String, enum: ContentType, required: true })
  type: ContentType;

  @Prop({ type: Object, required: true })
  content: {
    title?: I18nString;
    subtitle?: I18nString;
    description?: I18nString;
    imageUrl?: string;
    imageAlt?: I18nString;
    ctaText?: I18nString;
    ctaLink?: string;
    items?: Array<{
      title?: I18nString;
      description?: I18nString;
      imageUrl?: string;
      link?: string;
    }>;
    [key: string]: any; // Contenu flexible
  };

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: Date })
  expiresAt?: Date; // Pour les contenus temporaires
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);

// Index pour les performances
SiteContentSchema.index({ key: 1 });
SiteContentSchema.index({ type: 1, isActive: 1 });
SiteContentSchema.index({ publishedAt: 1, expiresAt: 1 });
