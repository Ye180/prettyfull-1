import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
    @Headers('accept-language') language: string = 'fr',
    @Body() addToCartDto: AddToCartDto,
  ) {
     console.log('🟢 Reçu du front:', addToCartDto);
    return this.cartsService.addToCart(userId, language, addToCartDto);
  }

  // @Delete(':userId/items/:productId')
  // async removeCartItem(
  //   @Param('userId') userId: string,
  //   @Param('productId') productId: string,
  //   @Body('selectedVariants') selectedVariants?: Record<string, string>,
  // ) {
  //   return this.cartsService.removeCartItem(
  //     userId,
  //     productId,
  //     selectedVariants,
  //   );
  // }

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
  @Body('selectedVariants') selectedVariants?: Record<string, string>,
) {
  return this.cartsService.removeCartItem(userId, productId, selectedVariants);
}


  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}
