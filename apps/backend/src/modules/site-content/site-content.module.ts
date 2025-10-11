import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SiteContentSchema,
  SiteContentSchemaDefinition,
} from '../../shared/schemas/site-content.schema';
import { SiteContentController } from './site-content.controller';
import { SiteContentService } from './site-content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteContentSchema.name, schema: SiteContentSchemaDefinition },
    ]),
  ],
  controllers: [SiteContentController],
  providers: [SiteContentService],
  exports: [SiteContentService],
})
export class SiteContentModule {}
