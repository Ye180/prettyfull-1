import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Address,
  AddressSchemaDefinition,
} from 'src/shared/schemas/address.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

// import { Order, Addresschema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Address.name, schema: AddressSchemaDefinition },
    ]),
    NotificationsModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
