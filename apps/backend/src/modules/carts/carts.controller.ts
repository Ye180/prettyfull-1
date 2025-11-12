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
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CartsServiceV2 } from './carts.service.v2';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

/**
 * ============================================================================
 * CARTS CONTROLLER - Using V2 Service (Redis + MongoDB)
 * ============================================================================
 */
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsServiceV2) {}
  @AllowAnonymous()
  @Get(':userId')
  async getCart(
    @Param('userId') userId: string,
    @Headers('accept-language') language: string = 'fr',
  ) {
    return this.cartsService.getCart(userId, language);
  }

  @AllowAnonymous()
  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Headers('accept-language') language: string = 'fr',
    @Body() addToCartDto: AddToCartDto,
  ) {
    console.log('🟢 Reçu du front:', addToCartDto);
    return this.cartsService.addToCart(userId, language, addToCartDto);
  }

  @AllowAnonymous()
  @Patch(':userId/items/:productId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Headers('accept-language') language: string = 'fr',
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(
      userId,
      productId,
      updateCartItemDto,
      language,
    );
  }

  @AllowAnonymous()
  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Headers('accept-language') language: string = 'fr',
    @Body('selectedVariants') selectedVariants?: Record<string, string>,
  ) {
    return this.cartsService.removeCartItem(
      userId,
      productId,
      selectedVariants,
      language,
    );
  }

  @AllowAnonymous()
  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }

  /**
   * Admin endpoint to force MongoDB sync
   */
  @Post(':userId/sync')
  async forceSync(@Param('userId') userId: string) {
    return this.cartsService.forceSync(userId);
  }
}
