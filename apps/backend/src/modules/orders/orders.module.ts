import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Address,
  AddressSchemaDefinition,
} from 'src/shared/schemas/address.schema';
import { AddressModule } from '../address/address.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  Product,
  ProductSchemaDefinition,
} from '../products/schemas/product.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchemaDefinition },
      { name: Address.name, schema: AddressSchemaDefinition },
    ]),
    AddressModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
