import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false, versionKey: false })
class I18nString {
  @Prop({ type: String, trim: true })
  fr: string;

  @Prop({ type: String, trim: true })
  en: string;
}
const I18nStringSchema = SchemaFactory.createForClass(I18nString);

@Schema({ _id: false, versionKey: false })
class FirstSection {
  @Prop({ type: I18nStringSchema })
  title: I18nString;

  @Prop({ type: I18nStringSchema })
  description: I18nString;

  @Prop({ type: String })
  imageUrlDesktop: string;

  @Prop({ type: String })
  imageUrlMobile: string;

  @Prop({ type: String })
  video: string;

  @Prop({ type: I18nStringSchema })
  ctaText: I18nString;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: MongooseSchema.Types.ObjectId;
}
const FirstSectionSchema = SchemaFactory.createForClass(FirstSection);

@Schema({ _id: false, versionKey: false })
class SecondSection {
  @Prop({ type: I18nStringSchema })
  title: I18nString;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }])
  category: MongooseSchema.Types.ObjectId[];

  @Prop({ type: I18nStringSchema })
  ctaText: I18nString;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  parentCategory: MongooseSchema.Types.ObjectId;
}
const SecondSectionSchema = SchemaFactory.createForClass(SecondSection);

@Schema({ _id: false, versionKey: false })
class ThirdSection {
  @Prop({ type: String })
  imageUrlDesktop: string;

  @Prop({ type: String })
  imageUrlMobile: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: MongooseSchema.Types.ObjectId;
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
  @Prop() products?: string[];
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
  @Prop() products?: string[];
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
export class SiteContent extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  key: string;

  @Prop({ type: String, enum: ['PAGE', 'SECTION'], required: true })
  type: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: I18nStringSchema })
  quote: I18nString;

  @Prop({ type: FirstSectionSchema })
  first: FirstSection;

  @Prop({ type: SecondSectionSchema })
  secondSection: SecondSection;

  @Prop({ type: ThirdSectionSchema })
  thirdSection: ThirdSection;

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

export type SiteContentDocument = SiteContent & Document;
