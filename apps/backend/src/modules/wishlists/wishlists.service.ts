import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../shared/redis/redis.constants';

@Injectable()
export class WishlistsService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  private getWishlistKey(userId: string): string {
    return `wishlist:user:${userId}`;
  }

  async addToWishlist(userId: string, productId: string): Promise<any> {
    const wishlistKey = this.getWishlistKey(userId);

    try {
      // Utilise SADD pour ajouter un produit au Set Redis
      const added = await this.redisClient.sadd(wishlistKey, productId);
      // Expire la wishlist après 90 jours
      await this.redisClient.expire(wishlistKey, 90 * 24 * 60 * 60);

      return {
        message:
          added === 1
            ? 'Produit ajouté à la wishlist'
            : 'Produit déjà dans la wishlist',
        added: added === 1,
      };
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message || "Erreur lors de l'ajout à la wishlist",
      );
    }
  }

  async getWishlist(userId: string): Promise<any> {
    const wishlistKey = this.getWishlistKey(userId);

    try {
      // Utilise SMEMBERS pour récupérer tous les produits de la wishlist
      const productIds = await this.redisClient.smembers(wishlistKey);

      return {
        userId,
        productIds,
        totalItems: productIds.length,
        updatedAt: new Date(),
      };
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la récupération de la wishlist',
      );
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<any> {
    const wishlistKey = this.getWishlistKey(userId);

    try {
      // Utilise SREM pour supprimer un produit du Set Redis
      const removed = await this.redisClient.srem(wishlistKey, productId);

      return {
        message:
          removed === 1
            ? 'Produit supprimé de la wishlist'
            : 'Produit non trouvé dans la wishlist',
        removed: removed === 1,
      };
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la suppression de la wishlist',
      );
    }
  }

  async clearWishlist(userId: string): Promise<{ message: string }> {
    const wishlistKey = this.getWishlistKey(userId);

    try {
      await this.redisClient.del(wishlistKey);
      return { message: 'Wishlist vidée avec succès' };
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la suppression de la wishlist',
      );
    }
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistKey = this.getWishlistKey(userId);

    try {
      // Utilise SISMEMBER pour vérifier si un produit est dans la wishlist
      const exists = await this.redisClient.sismember(wishlistKey, productId);
      return exists === 1;
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la vérification de la wishlist',
      );
    }
  }
}
