import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

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

class I18nPriceString {
  @Prop({ type: Number, required: true })
  fr: number;

  @Prop({ type: Number, required: true })
  en: number;
}

@Schema({ _id: false })
class Price {
  @Prop({
    type: {
      fr: { type: Number, required: true },
      en: { type: Number, required: true },
    },
    required: true,
  })
  amount: I18nPriceString;

  @Prop({
    type: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
    },
    required: true,
  })
  currency: I18nString;
}

@Schema({ _id: false })
class VariantProduct {
  @Prop({ type: String })
  id: string;

  @Prop({ type: ColorSchema, required: true })
  color: Color;

  @Prop({ type: [String], required: true })
  size: string[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Number, required: true, min: 0 })
  quantity: number;
}
const VariantProductSchema = SchemaFactory.createForClass(VariantProduct);

@Schema({ _id: false })
class NotVariantProduct {
  @Prop({ type: ColorSchema })
  color?: Color;

  @Prop({ type: [String], required: true })
  size: string[];

  @Prop({ type: [String], required: true })
  image: string[];

  @Prop({ type: Number, min: 0 })
  quantity?: number;
}

@Schema({ _id: false })
class Promotion {
  @Prop({
    type: {
      fr: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
      },
      en: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
      },
    },
    required: true,
  })
  reduced_price: {
    fr: { amount: number; currency: string };
    en: { amount: number; currency: string };
  };

  @Prop({ type: Number, required: true })
  pourcentage: number;
}
const PromotionSchema = SchemaFactory.createForClass(Promotion);

const NotVariantProductSchema = SchemaFactory.createForClass(NotVariantProduct);

@Schema({ _id: false })
class SeoMeta {
  @Prop({ type: I18nStringSchema, required: true })
  title: I18nString;

  @Prop({ type: I18nStringSchema, required: true })
  description: I18nString;

  @Prop({ type: [String], required: true })
  keywords: string[];
}
const SeoMetaSchema = SchemaFactory.createForClass(SeoMeta);

// --- SCHÉMA PRINCIPAL DU PRODUIT ---

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: I18nStringSchema, required: true })
  name: I18nString;

  @Prop({ type: I18nStringSchema, required: true })
  description: I18nString;

  @Prop({ type: String })
  category?: string;

  // Stock calculé automatiquement - plus besoin de le rendre required
  @Prop({ type: Number, min: 0, default: 0 })
  stock: number;

  @Prop({ type: String })
  link?: string;

  @Prop({ type: [VariantProductSchema] })
  variants: VariantProduct[];

  @Prop({ type: NotVariantProductSchema })
  notVariable?: NotVariantProduct;

  @Prop({ type: I18nStringSchema })
  smallDescription?: I18nString;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true, unique: true })
  sku: string;

  @Prop({ type: Price, required: true })
  price: Price;

  @Prop({ type: Boolean, default: false })
  solde?: boolean;

  @Prop({ type: PromotionSchema })
  promotion?: Promotion;

  @Prop({ type: Boolean, default: false })
  isLoading?: boolean;

  @Prop({ type: I18nStringSchema })
  label?: I18nString;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, required: true, default: true })
  isFeatured: boolean;

  @Prop({ type: SeoMetaSchema, required: true })
  seoMeta: SeoMeta;
}

// export const ProductSchemaDefinition = SchemaFactory.createForClass(Product);

export const ProductSchemaDefinition = SchemaFactory.createForClass(Product);

// Index pour la recherche
ProductSchemaDefinition.index({ name: 'text', description: 'text' });
ProductSchemaDefinition.index({ sku: 1, isActive: 1 });
ProductSchemaDefinition.index({ category: 1, isActive: 1 });

// Hook pre-save pour calculer automatiquement le stock total
ProductSchemaDefinition.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    // Calculer la somme des quantités de toutes les variantes
    this.stock = this.variants.reduce((total, variant) => {
      return total + (variant.quantity || 0);
    }, 0);
  } else if (this.notVariable) {
    // Si pas de variantes, utiliser la quantité du produit simple
    this.stock = this.notVariable.quantity || 0;
  }
  next();
});

// Hook pre-update pour recalculer le stock lors des mises à jour
ProductSchemaDefinition.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Partial<Product>;

  if (update.variants && update.variants.length > 0) {
    update.stock = update.variants.reduce(
      (total: number, variant: VariantProduct) => {
        return total + (variant.quantity || 0);
      },
      0,
    );
  } else if (update.notVariable) {
    update.stock = update.notVariable.quantity || 0;
  }

  next();
});
