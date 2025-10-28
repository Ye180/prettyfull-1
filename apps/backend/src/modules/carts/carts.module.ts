import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../../shared/redis/redis.module';
import { ProductsModule } from '../products/products.module';
import { ProductSchemaDefinition } from '../products/schemas/product.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchemaDefinition,
      },
    ]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
