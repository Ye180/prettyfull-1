import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../shared/redis/redis.constants';
import {
  AddToCartDto,
  CartResponseDto,
  UpdateCartItemDto,
} from './dto/cart.dto';

@Injectable()
export class CartsService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    const { productId, quantity, selectedVariants } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('La quantité doit être supérieure à 0');
    }

    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variantString = Object.entries(selectedVariants)
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
      itemKey = `${productId}:${variantString}`;
    }

    try {
      // Utilise HINCRBY pour incrémenter la quantité dans le hash Redis
      await this.redisClient.hincrby(cartKey, itemKey, quantity);
      // Expire le panier après 30 jours
      await this.redisClient.expire(cartKey, 30 * 24 * 60 * 60);
      return this.getCart(userId);
    } catch (error) {
      throw new BadRequestException("Erreur lors de l'ajout au panier");
    }
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    const cartKey = this.getCartKey(userId);

    try {
      // Utilise HGETALL pour récupérer tous les items du panier
      const cartItems = await this.redisClient.hgetall(cartKey);

      const items = Object.entries(cartItems).map(([itemKey, quantityStr]) => {
        const quantity = parseInt(quantityStr, 10);
        const parts = itemKey.split(':');
        const productId = parts[0] || '';
        const variantParts = parts.slice(1);
        const selectedVariants: Record<string, string> = {};

        if (variantParts.length > 0) {
          const variantString = variantParts.join(':');
          variantString.split(',').forEach((variant) => {
            const [key, value] = variant.split('=');
            if (key && value) {
              selectedVariants[key] = value;
            }
          });
        }

        return {
          productId,
          quantity,
          selectedVariants:
            Object.keys(selectedVariants).length > 0
              ? selectedVariants
              : undefined,
        };
      });

      const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      return {
        userId,
        items,
        totalItems,
        updatedAt: new Date(),
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération du panier');
    }
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const { quantity, selectedVariants } = updateCartItemDto;

    if (quantity < 0) {
      throw new BadRequestException('La quantité ne peut pas être négative');
    }

    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variantString = Object.entries(selectedVariants)
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
      itemKey = `${productId}:${variantString}`;
    }

    try {
      if (quantity === 0) {
        // Utilise HDEL pour supprimer l'item
        await this.redisClient.hdel(cartKey, itemKey);
      } else {
        // Utilise HSET pour définir la nouvelle quantité
        await this.redisClient.hset(cartKey, itemKey, quantity);
      }

      return this.getCart(userId);
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du panier');
    }
  }

  async removeFromCart(
    userId: string,
    productId: string,
    selectedVariants?: Record<string, string>,
  ): Promise<CartResponseDto> {
    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variantString = Object.entries(selectedVariants)
        .sort()
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
      itemKey = `${productId}:${variantString}`;
    }

    try {
      // Utilise HDEL pour supprimer l'item du hash
      await this.redisClient.hdel(cartKey, itemKey);
      return this.getCart(userId);
    } catch (error) {
      throw new BadRequestException(
        'Erreur lors de la suppression du produit du panier',
      );
    }
  }

  async clearCart(userId: string): Promise<{ message: string }> {
    const cartKey = this.getCartKey(userId);

    try {
      await this.redisClient.del(cartKey);
      return { message: 'Panier vidé avec succès' };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression du panier');
    }
  }
}
