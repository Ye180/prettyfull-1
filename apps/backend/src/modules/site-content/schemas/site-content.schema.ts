import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteContentDocument = SiteContent & Document;

export enum ContentType {
  SECTION = 'SECTION',
  BANNER = 'BANNER',
  CATEGORY = 'CATEGORY',
}

export class I18nString {
  fr?: string;
  en?: string;
}

/* -----------------------------------------------------------
 * 📌 Base réutilisable pour éviter les répétitions
 * ----------------------------------------------------------- */
@Schema()
export class BaseSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: Object }) description?: I18nString;
  @Prop() imageUrlDesktop?: string;
  @Prop() imageUrlMobile?: string;
  @Prop() video?: string;
  @Prop() category?: string;
}
// const BaseSectionSchema = SchemaFactory.createForClass(BaseSection);

/* -----------------------------------------------------------
 * 1️⃣ firstSection
 * ----------------------------------------------------------- */
@Schema()
export class FirstSection extends BaseSection {
  @Prop() paragraphe?: string;
  @Prop({ type: Object }) textbutton?: I18nString;
}
const FirstSectionSchema = SchemaFactory.createForClass(FirstSection);

/* -----------------------------------------------------------
 * 2️⃣ secondSection
 * ----------------------------------------------------------- */
@Schema()
export class SecondSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: String }) category?: string;
  @Prop({ type: Object }) ctaText?: I18nString;
  @Prop({ type: String }) parentCategory?: string;
}
const SecondSectionSchema = SchemaFactory.createForClass(SecondSection);

/* -----------------------------------------------------------
 * 3️⃣ thirdSection
 * ----------------------------------------------------------- */
@Schema()
export class ThirdSection {
  @Prop() imageUrlDesktop?: string;
  @Prop() imageUrlMobile?: string;
  @Prop() category?: string;
}
const ThirdSectionSchema = SchemaFactory.createForClass(ThirdSection);

/* -----------------------------------------------------------
 * 4️⃣ fourthSection (avec produits)
 * ----------------------------------------------------------- */
@Schema()
export class FourthSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: Object }) description?: I18nString;
  @Prop() imageUrl?: string;
  @Prop() category?: string;
  @Prop({
    type: [
      {
        id: Number,
        name: String,
        price: Number,
        imageUrl: String,
      },
    ],
  })
  products?: Array<{
    id?: number;
    name?: string;
    price?: number;
    imageUrl?: string;
  }>;
}
const FourthSectionSchema = SchemaFactory.createForClass(FourthSection);

/* -----------------------------------------------------------
 * 5️⃣ fiveSection (catégorie + sous-catégories)
 * ----------------------------------------------------------- */
@Schema()
export class FiveSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: String }) category?: string;
  @Prop({ type: Object }) ctaText?: I18nString;
  @Prop({ type: [String] }) subCategory?: string[];
}
const FiveSectionSchema = SchemaFactory.createForClass(FiveSection);

/* -----------------------------------------------------------
 * 6️⃣ sixSection (images seulement)
 * ----------------------------------------------------------- */
@Schema()
export class SixSection {
  @Prop() imageUrlDesktop?: string;
  @Prop() imageUrlMobile?: string;
  @Prop() category?: string;
}
const SixSectionSchema = SchemaFactory.createForClass(SixSection);

/* -----------------------------------------------------------
 * 7️⃣ sevenSection (produits + sous-catégorie)
 * ----------------------------------------------------------- */
@Schema()
export class SevenSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: Object }) ctaText?: I18nString;
  @Prop({ type: String }) subCategory?: string;
  @Prop({
    type: [
      {
        id: Number,
        name: String,
        price: Number,
        imageUrl: String,
      },
    ],
  })
  products?: Array<{
    id?: number;
    name?: string;
    price?: number;
    imageUrl?: string;
  }>;
}
const SevenSectionSchema = SchemaFactory.createForClass(SevenSection);

/* -----------------------------------------------------------
 * 8️⃣ eightSection
 * ----------------------------------------------------------- */
@Schema()
export class EightSection {
  @Prop() imageUrlDesktop?: string;
  @Prop() imageUrlMobile?: string;
  @Prop({ type: String }) category?: string;
}
const EightSectionSchema = SchemaFactory.createForClass(EightSection);

/* -----------------------------------------------------------
 * 9️⃣ nineSection
 * ----------------------------------------------------------- */
@Schema()
export class NineSection {
  @Prop({ type: Object }) title?: I18nString;
  @Prop({ type: Object }) ctaText?: I18nString;
  @Prop({ type: [String] }) subCategory?: string[];
  @Prop({ type: String }) category?: string;
}
const NineSectionSchema = SchemaFactory.createForClass(NineSection);

/* -----------------------------------------------------------
 * 🔟 tenSection
 * ----------------------------------------------------------- */
@Schema()
export class TenSection {
  @Prop() imageUrlDesktop?: string;
  @Prop() imageUrlMobile?: string;
  @Prop() category?: string;
}
const TenSectionSchema = SchemaFactory.createForClass(TenSection);

/* -----------------------------------------------------------
 * 🏗️ SiteContent global
 * ----------------------------------------------------------- */
@Schema({ timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: String, enum: ContentType, required: true })
  type: ContentType;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Object })
  quote?: I18nString;

  @Prop({ type: FirstSectionSchema })
  firstSection?: FirstSection;

  @Prop({ type: SecondSectionSchema })
  secondSection?: SecondSection;

  @Prop({ type: ThirdSectionSchema })
  thirdSection?: ThirdSection;

  @Prop({ type: FourthSectionSchema })
  fourthSection?: FourthSection;

  @Prop({ type: FiveSectionSchema })
  fiveSection?: FiveSection;

  @Prop({ type: SixSectionSchema })
  sixSection?: SixSection;

  @Prop({ type: SevenSectionSchema })
  sevenSection?: SevenSection;

  @Prop({ type: EightSectionSchema })
  eightSection?: EightSection;

  @Prop({ type: NineSectionSchema })
  nineSection?: NineSection;

  @Prop({ type: TenSectionSchema })
  tenSection?: TenSection;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: Date })
  expiresAt?: Date;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
