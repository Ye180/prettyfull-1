import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../../shared/redis/redis.module';
import { ProductsModule } from '../products/products.module';
import { ProductSchemaDefinition } from '../products/schemas/product.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartsServiceV2 } from './carts.service.v2';
import { Cart, CartSchema } from './schemas/carts.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductSchemaDefinition,
      },
      {
        name: Cart.name,
        schema: CartSchema,
      },
    ]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsServiceV2],
  exports: [CartsService, CartsServiceV2],
})
export class CartsModule {}
