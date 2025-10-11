import { Controller, Get, Post, Patch, Delete, Body, Param, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartsService.getCart(userId);
  }

  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartsService.addToCart(userId, addToCartDto);
  }

  @Patch(':userId/items/:productId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(userId, productId, updateCartItemDto);
  }

  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartsService.removeFromCart(userId, productId);
  }

  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}
