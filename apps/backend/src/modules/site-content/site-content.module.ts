import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import {
  Product,
  ProductSchemaDefinition,
} from '../products/schemas/product.schema';
import { StorageModule } from '../storage/storage.module';
import { SiteContent, SiteContentSchema } from './schemas/site-content.schema';
import { SiteContentController } from './site-content.controller';
import { SiteContentService } from './site-content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteContent.name, schema: SiteContentSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchemaDefinition },
    ]),
    StorageModule,
  ],
  controllers: [SiteContentController],
  providers: [SiteContentService],
  exports: [SiteContentService],
})
export class SiteContentModule {}
