import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentType } from '../../../shared/schemas/site-content.schema';

export class CreateSiteContentDto {
  @IsString()
  key: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsObject()
  content: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: {
    tags?: string[];
    author?: string;
    notes?: string;
  };
}
