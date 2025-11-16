import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  Product,
  ProductSchemaDefinition,
} from '../products/schemas/product.schema';
import { SiteContentModule } from '../site-content/site-content.module';
import { StorageModule } from '../storage';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },

      { name: Product.name, schema: ProductSchemaDefinition },
    ]),
    NotificationsModule,
    SiteContentModule,
    StorageModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
