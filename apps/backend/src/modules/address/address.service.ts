import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  formatResponse,
  FormatResponse,
} from 'src/shared/utils/format-response';
import { NotificationsProducerService } from '../notifications/notifications.producer.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-product.dto';
import { Address, AddressDocument } from './schemas/address.schema';

export interface CreateOrderDto {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedVariants?: Record<string, string>;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private address: Model<AddressDocument>,
    private readonly notificationsProducer: NotificationsProducerService,
  ) {}

  //GET ALL ADDRESSES
  async getAllAddresses(): Promise<FormatResponse<AddressDocument[]>> {
    const addresses = await this.address.find().exec();
    return formatResponse({
      data: addresses,
      message: 'Addresses retrieved successfully',
    });
  }

  /**
   * Crée une nouvelle address
   */
  async createAddress(
    addressDto: AddressDto,
  ): Promise<FormatResponse<AddressDocument>> {
    const createdAddress = new this.address(addressDto);
    await createdAddress.save();
    return formatResponse({
      data: createdAddress,
      message: 'Address created successfully',
    });
  }

  // ============================================================================
  // PUBLIC ADDRESS METHODS
  // ============================================================================
  async getAddressById(
    id: string,
  ): Promise<FormatResponse<AddressDocument | null>> {
    const address = await this.address.findById(id).exec();
    return formatResponse({
      data: address,
      message: address ? 'Address retrieved successfully' : 'Address not found',
    });
  }

  async getAddressesByUserId(
    userId: string,
  ): Promise<FormatResponse<AddressDocument[]>> {
    const addresses = await this.address.find({ userId }).exec();
    return formatResponse({
      data: addresses,
      message: 'Addresses retrieved successfully',
    });
  }

  async makeDefaultAddress(
    id: string,
    userId: string,
    data: boolean = true,
  ): Promise<FormatResponse<AddressDocument | null>> {
    // unset any other default addresses for the user
    await this.address
      .updateMany({ userId, isDefault: data }, { isDefault: false })
      .exec();

    // set the requested address as default
    const updatedAddress = await this.address
      .findByIdAndUpdate(id, { isDefault: true }, { new: true })
      .exec();

    return formatResponse({
      data: updatedAddress,
      message: updatedAddress
        ? 'Address set as default successfully'
        : 'Address not found',
    });
  }

  async getDefaultAddressByUserId(
    userId: string,
  ): Promise<FormatResponse<AddressDocument[]>> {
    const addresses = await this.address
      .find({ userId, isDefault: true })
      .exec();
    return formatResponse({
      data: addresses,
      message: addresses
        ? 'Default address retrieved successfully'
        : 'No default address found',
    });
  }

  async updateAddress(
    id: string,
    addressDto: UpdateAddressDto,
  ): Promise<FormatResponse<AddressDocument | null>> {
    const addressUpdated = await this.address
      .findByIdAndUpdate(id, addressDto, { new: true })
      .exec();
    return formatResponse({
      data: addressUpdated as AddressDocument | null,
      message: addressUpdated
        ? 'Address updated successfully'
        : 'Address not found',
    });
  }

  async deleteAddress(
    id: string,
  ): Promise<FormatResponse<AddressDocument | null>> {
    const address = await this.address.findByIdAndDelete(id).exec();
    return formatResponse({
      data: address,
      message: address ? 'Address deleted successfully' : 'Address not found',
    });
  }
}
