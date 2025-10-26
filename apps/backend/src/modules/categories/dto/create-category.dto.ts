import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class I18nFieldDto {
  @IsString()
  fr!: string;

  @IsString()
  en!: string;
}

export class CategorySeoMetaDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nFieldDto)
  title?: I18nFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => I18nFieldDto)
  description?: I18nFieldDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => I18nFieldDto)
  name!: I18nFieldDto;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens (e.g., "electronics-phones")',
  })
  slug!: string;

  @ValidateNested()
  @Type(() => I18nFieldDto)
  description!: I18nFieldDto;

  /**
   * ID de la catégorie parente (null = catégorie racine)
   */
  @IsOptional()
  @IsString()
  parentId?: string | null;

  /**
   * Codes pays ISO 3166-1 alpha-2 (ex: ['FR', 'SN', 'CI'])
   * Vide = disponible partout
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Z]{2}$/, {
    each: true,
    message: 'Country codes must be ISO 3166-1 alpha-2 (e.g., "FR", "SN")',
  })
  countries?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategorySeoMetaDto)
  seoMeta?: CategorySeoMetaDto;

  @IsOptional()
  @IsObject()
  metadata?: {
    color?: string;
    badge?: string;
    featured?: boolean;
    [key: string]: any;
  };
}
