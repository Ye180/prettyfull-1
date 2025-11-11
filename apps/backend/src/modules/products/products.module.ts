import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesModule } from '../categories/categories.module';
import { StorageModule } from '../storage';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchemaDefinition } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchemaDefinition,
      },
    ]),
    CategoriesModule,
    StorageModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Exporté pour OrdersService
})
export class ProductsModule {}
