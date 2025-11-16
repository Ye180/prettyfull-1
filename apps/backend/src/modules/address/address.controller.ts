import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-product.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: AddressDto,
    @Session() session: UserSession,
  ) {
    return this.addressService.createAddress(createAddressDto);
  }

  //Get all Address
  @Get()
  async findAll(@Session() session: UserSession) {
    return this.addressService.getAllAddresses();
  }

  // * GET /address - Authenticated
  @Get(':id')
  async findAddressesById(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.addressService.getAddressById(id);
  }

  @Get(':userId')
  async findUserAddresses(
    @Param('userId') userId: string,
    @Session() session: UserSession,
  ) {
    return this.addressService.getAddressById(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Session() session: UserSession,
  ) {
    return this.addressService.updateAddress(id, updateAddressDto);
  }

  //Get default address
  @Get(':userId/default')
  async findDefaultAddress(
    @Param('userId') userId: string,
    @Session() session: UserSession,
  ) {
    return this.addressService.getDefaultAddressByUserId(userId);
  }

  //Make all address default
  @Post(':userId/default/id')
  async makeDefault(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('default') defaultValue: boolean,
    @Session() session: UserSession,
  ) {
    return this.addressService.makeDefaultAddress(id, userId, defaultValue);
  }

  //Remove address
  @Delete(':id')
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.addressService.deleteAddress(id);
  }

  // ============================================================================
  // ADMIN ADDRESS METHODS
  // ============================================================================
}
