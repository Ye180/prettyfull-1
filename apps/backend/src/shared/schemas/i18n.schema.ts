import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Interface pour les chaînes internationalisées
export interface I18nString {
  fr: string;
  en: string;
}

// Classe pour les chaînes i18n
@Schema({ _id: false })
export class I18nStringClass {
  @Prop({ required: true })
  fr: string;

  @Prop({ required: true })
  en: string;
}

// Schéma Mongoose pour les chaînes i18n
export const I18nStringSchema = SchemaFactory.createForClass(I18nStringClass);

// Interface pour les prix (toujours stockés en XOF)
export interface Price {
  amount: number; // Montant en XOF (devise de base)
  currency: 'XOF'; // Toujours XOF en base
}

// Classe pour les prix
@Schema({ _id: false })
export class PriceClass {
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, default: 'XOF', enum: ['XOF'] })
  currency: string;
}

// Schéma Mongoose pour les prix
export const PriceSchema = SchemaFactory.createForClass(PriceClass);

// Enum pour les langues supportées
export enum SupportedLanguage {
  FR = 'fr',
  EN = 'en',
}

// Enum pour les devises supportées
export enum SupportedCurrency {
  XOF = 'XOF',
  USD = 'USD',
}

// Helper type pour les requêtes avec contexte i18n
export interface I18nContext {
  language: SupportedLanguage;
  currency: SupportedCurrency;
}
