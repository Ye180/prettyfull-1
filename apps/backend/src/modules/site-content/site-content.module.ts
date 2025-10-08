import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteContent, SiteContentSchema } from './schemas/site-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteContent.name, schema: SiteContentSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SiteContentModule {}
