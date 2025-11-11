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
import { AllowAnonymous } from '@thallesp/nestjs-better-auth'; // ⬅️ 1. IMPORTER LE BON DÉCORATEUR

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @AllowAnonymous() // ⬅️ 2. AJOUTER POUR LES INVITÉS
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartsService.getCart(userId);
  }

  @AllowAnonymous() // ⬅️ 3. AJOUTER POUR LES INVITÉS
  @Post(':userId/items')
  async addToCart(
    @Param('userId') userId: string,
    @Headers('accept-language') language: string = 'fr',
    @Body() addToCartDto: AddToCartDto,
  ) {
     console.log('🟢 Reçu du front:', addToCartDto);
    return this.cartsService.addToCart(userId, language, addToCartDto);
  }

  @AllowAnonymous() // ⬅️ 4. AJOUTER POUR LES INVITÉS
  @Patch(':userId/items/:productId')
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateCartItem(userId, productId, updateCartItemDto);
  }

  @AllowAnonymous() // ⬅️ 5. AJOUTER POUR LES INVITÉS
  @Delete(':userId/items/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('selectedVariants') selectedVariants?: Record<string, string>,
  ) {
    return this.cartsService.removeCartItem(userId, productId, selectedVariants);
  }

  @AllowAnonymous() // ⬅️ 6. AJOUTER POUR LES INVITÉS
  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}