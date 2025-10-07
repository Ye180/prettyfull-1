import { Prop, Schema } from '@nestjs/mongoose';

// Interface pour les chaînes internationalisées
export interface I18nString {
  fr: string;
  en: string;
}

// Schéma pour les chaînes i18n
@Schema({ _id: false })
export class I18nStringSchema {
  @Prop({ required: true })
  fr: string;

  @Prop({ required: true })
  en: string;
}

// Interface pour les prix (toujours stockés en XOF)
export interface Price {
  amount: number; // Montant en XOF (devise de base)
  currency: 'XOF'; // Toujours XOF en base
}

// Schéma pour les prix
@Schema({ _id: false })
export class PriceSchema {
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, default: 'XOF', enum: ['XOF'] })
  currency: string;
}

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
