import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-product.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createAddressDto: AddressDto) {
    return this.addressService.createAddress(createAddressDto);
  }

  //Get all Address
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.addressService.getAllAddresses();
  }

  // * GET /address - Authenticated
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findAddressesById(
    @Param('id') id: string,
    // @Query('page', ParseIntPipe) page: number = 1,
    // @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.addressService.getAddressById(id);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async findUserAddresses(
    @Param('userId') userId: string,
    // @Query('page', ParseIntPipe) page: number = 1,
    // @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.addressService.getAddressById(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.updateAddress(id, updateAddressDto);
  }

  //Get default address
  @Get(':userId/default')
  @UseGuards(JwtAuthGuard)
  async findDefaultAddress(@Param('userId') userId: string) {
    return this.addressService.getDefaultAddressByUserId(userId);
  }

  //Make all address default
  @Post(':userId/default/id')
  @UseGuards(JwtAuthGuard)
  async makeDefault(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('default') defaultValue: boolean,
  ) {
    return this.addressService.makeDefaultAddress(id, userId, defaultValue);
  }

  //Remove address
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.addressService.deleteAddress(id);
  }

  // ============================================================================
  // ADMIN ADDRESS METHODS
  // ============================================================================
}
