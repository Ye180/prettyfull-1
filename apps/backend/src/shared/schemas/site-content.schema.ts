import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteContentDocument = SiteContentSchema & Document;

export enum ContentType {
  BANNER = 'banner',
  HERO = 'hero',
  PAGE = 'page',
  BLOCK = 'block',
}

@Schema({ timestamps: true })
export class SiteContentSchema {
  @Prop({ required: true, unique: true, index: true })
  key: string; // Identifiant unique (ex: 'home-hero-banner')

  @Prop({ type: String, enum: ContentType, required: true, index: true })
  type: ContentType; // Type de contenu

  @Prop({ type: Object, required: true })
  content: Record<string, any>; // Contenu flexible avec i18n

  @Prop({ default: true, index: true })
  isActive: boolean; // Publié ou brouillon

  @Prop({ type: Date })
  publishedAt?: Date; // Date de publication

  @Prop()
  publishedBy?: string; // Utilisateur ayant publié

  @Prop({ type: Object })
  metadata?: {
    version?: number;
    tags?: string[];
    author?: string;
    notes?: string;
  };
}

export const SiteContentSchemaDefinition =
  SchemaFactory.createForClass(SiteContentSchema);

// Index pour les recherches
SiteContentSchemaDefinition.index({ key: 1, isActive: 1 });
SiteContentSchemaDefinition.index({ type: 1, isActive: 1 });
