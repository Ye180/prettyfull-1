import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContentType } from '../constants/content.constants';
import {
  EightSectionDto,
  FirstSectionDto,
  FiveSectionDto,
  FourthSectionDto,
  I18nStringDto,
  NineSectionDto,
  SecondSectionDto,
  SevenSectionDto,
  SixSectionDto,
  TenSectionDto,
  ThirdSectionDto,
} from './create-site-content.dto';

/* -----------------------------------------------------------
 * 📝 STEP 1 DTO - Informations générales + Sections 1-3
 * ----------------------------------------------------------- */
export class CreateStep1Dto {
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  type: ContentType;

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
  first?: FirstSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecondSectionDto)
  secondSection?: SecondSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThirdSectionDto)
  thirdSection?: ThirdSectionDto;
}

/* -----------------------------------------------------------
 * 📝 STEP 2 DTO - Sections 4, 5 et 6
 * ----------------------------------------------------------- */
export class UpdateStep2Dto {
  @IsOptional()
  id?: string;

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
}

/* -----------------------------------------------------------
 * 📝 STEP 3 DTO - Sections 7, 8, 9 et 10
 * ----------------------------------------------------------- */
export class UpdateStep3Dto {
  @IsOptional()
  id?: string;

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
}
