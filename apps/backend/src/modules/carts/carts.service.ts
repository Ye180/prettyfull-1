import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../shared/redis/redis.constants';
import { ProductsService } from '../products/products.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private productService: ProductsService,

    // private productModel: Model<ProductDocument>,
  ) {}

  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async addToCart(
    userId: string,
    language: string,
    addToCartDto: AddToCartDto,
  ) {
    const { productId, quantity, selectedVariants } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('La quantité doit être supérieure à 0');
    }

    const cartKey = this.getCartKey(userId);

    // --- Construction d’une clé stable pour Redis ---
    let itemKey = productId;
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      // Incrémente ou crée l’item dans le panier Redis
      await this.redisClient.hincrby(cartKey, itemKey, quantity);

      // Expiration du panier : 30 jours
      await this.redisClient.expire(cartKey, 30 * 24 * 60 * 60);

      // Retourne le panier complet
      // return await this.getCart(userId, language);
    } catch (error: unknown) {
      throw new BadRequestException(
        (error as Error).message || "Erreur lors de l'ajout au panier",
      );
    }
  }

  async getCart(userId: string, language: string = 'fr') {
    const cartKey = this.getCartKey(userId);

    try {
      const cartItems = await this.redisClient.hgetall(cartKey);

      // Vérifier si le panier est vide
      if (Object.keys(cartItems).length === 0) {
        return {
          items: [],
          itemsCount: 0,
        };
      }

      // Correction : utiliser Promise.all avec les bonnes données
      const items = await Promise.all(
        Object.entries(cartItems).map(async ([itemKey, quantityStr]) => {
          const quantity = parseInt(quantityStr, 10);
          const [productId, ...variantParts] = itemKey.split('|');

          const selectedVariants: Record<string, string> = {};
          variantParts.forEach((variant) => {
            const [key, value] = variant.split('=');
            if (key && value) {
              selectedVariants[key] = value;
            }
          });

          Logger.log('Fetching product for ID:', productId);

          try {
            const product = await this.productService.findOne(
              productId as string,
              language,
            );

            return {
              productId,
              sku: product.sku,
              name: product.name[language],
              image:
                product.variable?.[0]?.image[0] ||
                product.notVariable?.image[0],
              quantity,
              unitPrice: {
                amount: product.price.amount[language],
                currency: product.price.currency[language],
              },
              totalPrice: {
                amount: product.price.amount[language] * quantity,
                currency: product.price.currency[language],
              },
              promotion: product.promotion
                ? {
                    reduced_price: {
                      amount: product.promotion.reduced_price[language].amount,
                      currency:
                        product.promotion.reduced_price[language].currency,
                    },
                    pourcentage: product.promotion.pourcentage,
                  }
                : undefined,
              isActive: product.isActive,
              selectedVariants:
                Object.keys(selectedVariants).length > 0
                  ? selectedVariants
                  : undefined,
            };
          } catch (productError) {
            Logger.error('Error fetching product:', productError);
            return {
              productId,
              sku: productId,
              name: { fr: 'Produit non trouvé', en: 'Product not found' }[
                language
              ],
              quantity,
              unitPrice: {
                amount: 0,
                currency: 'XOF',
              },
              totalPrice: {
                amount: 0,
                currency: 'XOF',
              },
              isActive: false,
              selectedVariants:
                Object.keys(selectedVariants).length > 0
                  ? selectedVariants
                  : undefined,
            };
          }
        }),
      );

      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
      const subtotalAmount = items.reduce(
        (acc, item) =>
          acc +
          (item.promotion
            ? item.promotion.reduced_price.amount * item.quantity
            : item.totalPrice.amount),
        0,
      );

      Logger.log('Cart items processed:', items);

      return {
        userId,
        items,
        totalItems,
        subtotal: {
          amount: subtotalAmount,
          currency: 'XOF',
        },
        total: {
          amount: subtotalAmount,
          currency: 'XOF',
        },
        updatedAt: new Date(),
      };
    } catch (error) {
      Logger.error('Error in getCart:', error);
      throw new BadRequestException(
        (error as Error).message || 'Erreur lors de la récupération du panier',
      );
    }
  }

  removeCartItem = async (
    userId: string,
    productId: string,
    selectedVariants?: Record<string, string>,
  ) => {
    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    // Correction : utiliser le même format que dans addToCart (avec | au lieu de :)
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      // Debug : vérifier la clé avant suppression
      Logger.log('Attempting to remove item with key:', itemKey);

      // Vérifier si l'item existe
      const exists = await this.redisClient.hexists(cartKey, itemKey);
      Logger.log('Item exists:', exists);

      if (!exists) {
        // Si l'item n'existe pas, lister toutes les clés pour debug
        const allItems = await this.redisClient.hkeys(cartKey);
        Logger.log('Available cart keys:', allItems);
        throw new BadRequestException('Produit non trouvé dans le panier');
      }

      // Utilise HDEL pour supprimer l'item
      const result = await this.redisClient.hdel(cartKey, itemKey);
      Logger.log('Delete result:', result);

      return this.getCart(userId);
    } catch (error) {
      Logger.error('Error in removeCartItem:', error);
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la suppression du produit du panier',
      );
    }
  };

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity, selectedVariants } = updateCartItemDto;

    if ((quantity as number) < 0) {
      throw new BadRequestException('La quantité ne peut pas être négative');
    }

    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    // Correction : utiliser le même format que dans addToCart (avec | au lieu de :)
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      if (quantity === 0) {
        // Utilise HDEL pour supprimer l'item
        await this.redisClient.hdel(cartKey, itemKey);
      } else {
        // Utilise HSET pour définir la nouvelle quantité
        await this.redisClient.hset(cartKey, itemKey, quantity as number);
      }

      return this.getCart(userId);
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message || 'Erreur lors de la mise à jour du panier',
      );
    }
  }

  async removeFromCart(
    userId: string,
    productId: string,
    selectedVariants?: Record<string, string>,
  ) {
    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    // Correction : utiliser le même format que dans addToCart (avec | au lieu de :)
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      // Utilise HDEL pour supprimer l'item du hash
      await this.redisClient.hdel(cartKey, itemKey);
      return this.getCart(userId);
    } catch (error) {
      throw new BadRequestException(
        (error as Error).message ||
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
      throw new BadRequestException(
        (error as Error).message || 'Erreur lors de la suppression du panier',
      );
    }
  }
}
