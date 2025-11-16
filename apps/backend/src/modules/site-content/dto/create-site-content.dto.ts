import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
// import { ContentType } from '../schemas/site-content.schema';

/* -----------------------------------------------------------
 * 🌍 I18nString
 * ----------------------------------------------------------- */
export class I18nStringDto {
  @IsOptional()
  @IsString()
  fr?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

/* -----------------------------------------------------------
 * 🧩 Sections DTO
 * ----------------------------------------------------------- */
export class BaseSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  description?: I18nStringDto;

  @IsOptional()
  @IsString()
  imageUrlDesktop?: string;

  @IsOptional()
  @IsString()
  imageUrlMobile?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

/* 1️⃣ First Section */
export class FirstSectionDto extends BaseSectionDto {
  @IsOptional()
  @IsString()
  paragraphe?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  ctaText?: I18nStringDto;
}

/* 2️⃣ Second Section */
export class SecondSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @IsArray()
  category?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  ctaText?: I18nStringDto;

  @IsOptional()
  @IsString()
  parentCategory?: string;
}

/* 3️⃣ Third Section */
export class ThirdSectionDto {
  @IsOptional()
  @IsString()
  imageUrlDesktop?: string;

  @IsOptional()
  @IsString()
  imageUrlMobile?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

/* 4️⃣ Fourth Section */
export class ProductDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class FourthSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  description?: I18nStringDto;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];
}

/* 5️⃣ Five Section */
export class FiveSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  ctaText?: I18nStringDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subCategory?: string[];
}

/* 6️⃣ Six Section */
export class SixSectionDto {
  @IsOptional()
  @IsString()
  imageUrlDesktop?: string;

  @IsOptional()
  @IsString()
  imageUrlMobile?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

/* 7️⃣ Seven Section */
export class SevenSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  ctaText?: I18nStringDto;

  @IsOptional()
  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsArray()
  products?: string[];
}

/* 8️⃣ Eight Section */
export class EightSectionDto {
  @IsOptional()
  @IsString()
  imageUrlDesktop?: string;

  @IsOptional()
  @IsString()
  imageUrlMobile?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

/* 9️⃣ Nine Section */
export class NineSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title?: I18nStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  ctaText?: I18nStringDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subCategory?: string[];

  @IsOptional()
  @IsString()
  category?: string;
}

/* 🔟 Ten Section */
export class TenSectionDto {
  @IsOptional()
  @IsString()
  imageUrlDesktop?: string;

  @IsOptional()
  @IsString()
  imageUrlMobile?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

/* -----------------------------------------------------------
 * 🏗️ SiteContent DTO principal
 * ----------------------------------------------------------- */
export class CreateSiteContentDto {
  @IsString()
  key: string;

  // @IsOptional()
  // @IsEnum(ContentType)
  // type: ContentType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nStringDto)
  quote?: I18nStringDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FirstSectionDto)
  firstSection?: FirstSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecondSectionDto)
  secondSection?: SecondSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThirdSectionDto)
  thirdSection?: ThirdSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FourthSectionDto)
  fourthSection?: FourthSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FiveSectionDto)
  fiveSection?: FiveSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SixSectionDto)
  sixSection?: SixSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SevenSectionDto)
  sevenSection?: SevenSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EightSectionDto)
  eightSection?: EightSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => NineSectionDto)
  nineSection?: NineSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TenSectionDto)
  tenSection?: TenSectionDto;

  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}

/* -----------------------------------------------------------
 * ✏️ DTO pour update (tout est optionnel)
 * ----------------------------------------------------------- */
export class UpdateSiteContentDto extends CreateSiteContentDto {}
