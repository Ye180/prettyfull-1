// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type CategoryDocument = CategorySchema & Document;

// /**
//  * Schéma de catégorie avec support :
//  * - Hiérarchie multi-niveaux (parent/enfants)
//  * - Multi-langue (FR/EN)
//  * - Multi-pays (disponibilité par pays)
//  */
// @Schema({ timestamps: true })
// export class CategorySchema {
//   @Prop({ type: Object, required: true })
//   name: { fr: string; en: string };

//   @Prop({ required: true, unique: true, index: true })
//   slug: string;

//   @Prop({ type: Object, required: true })
//   description: { fr: string; en: string };

//   /**
//    * Référence vers la catégorie parente
//    * null = catégorie racine
//    */
//   @Prop({
//     type: Types.ObjectId,
//     ref: 'CategorySchema',
//     default: null,
//     index: true,
//   })
//   parent: Types.ObjectId | null;

//   /**
//    * Niveau dans la hiérarchie (0 = racine, 1 = sous-catégorie, etc.)
//    */
//   @Prop({ default: 0, index: true })
//   level: number;

//   /**
//    * Chemin complet de la hiérarchie (ex: "electronics/computers/laptops")
//    * Permet des requêtes optimisées
//    */
//   @Prop({ type: [String], default: [] })
//   path: string[];

//   /**
//    * Liste des codes pays où cette catégorie est disponible
//    * Exemples : ['FR', 'SN', 'CI', 'ML', 'BF']
//    * [] = disponible dans tous les pays
//    */
//   @Prop({ type: [String], default: [], index: true })
//   countries: string[];

//   @Prop({ default: true })
//   isActive: boolean;

//   @Prop({ default: true })
//   isVisible: boolean;

//   /**
//    * Ordre d'affichage (0 = en premier)
//    */
//   @Prop({ default: 0 })
//   displayOrder: number;

//   /**
//    * Icône de la catégorie (nom FontAwesome, Heroicons, ou URL)
//    */
//   @Prop()
//   icon?: string;

//   /**
//    * Image de bannière de la catégorie
//    */
//   @Prop()
//   image?: string;

//   /**
//    * Nombre de produits dans cette catégorie (denormalisé pour perf)
//    */
//   @Prop({ default: 0 })
//   productCount: number;

//   /**
//    * Métadonnées SEO
//    */
//   @Prop({ type: Object })
//   seoMeta?: {
//     title?: { fr: string; en: string };
//     description?: { fr: string; en: string };
//     keywords?: string[];
//   };

//   /**
//    * Métadonnées supplémentaires (couleur, badges, etc.)
//    */
//   @Prop({ type: Object })
//   metadata?: {
//     color?: string;
//     badge?: string;
//     featured?: boolean;
//     [key: string]: any;
//   };
// }

// export const CategorySchemaDefinition =
//   SchemaFactory.createForClass(CategorySchema);

// // Index composites pour performances optimales
// CategorySchemaDefinition.index({ slug: 1, isActive: 1 });
// CategorySchemaDefinition.index({ parent: 1, isActive: 1, displayOrder: 1 });
// CategorySchemaDefinition.index({ countries: 1, isActive: 1 });
// CategorySchemaDefinition.index({ level: 1, parent: 1 });
// CategorySchemaDefinition.index({ isActive: 1, isVisible: 1, displayOrder: 1 });
