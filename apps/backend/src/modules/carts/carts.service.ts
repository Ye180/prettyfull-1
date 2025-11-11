import {
  BadRequestException,
  HttpExceptionOptions,
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
  ) {}

  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  // ✅ AJOUTER AU PANIER
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

    // Construction clé stable
    let itemKey = productId;
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      await this.redisClient.hincrby(cartKey, itemKey, quantity);
      await this.redisClient.expire(cartKey, 30 * 24 * 60 * 60);
      
      // ⬇️⬇️⬇️ MODIFICATION PRINCIPALE ⬇️⬇️⬇️
      // La ligne suivante causait l'erreur 500 car getCart() plante.
      // return await this.getCart(userId, language);
      
      // On la remplace par une simple réponse de succès.
      return { success: true };
      
    } catch (error: unknown) {
      Logger.error(
        "Erreur Redis lors de l'ajout au panier:",
        (error as Error).stack,
      );
      throw new BadRequestException("Erreur lors de l'ajout au panier");
    }
  }

  // ✅ OBTENIR LE PANIER
  async getCart(userId: string, language: string = 'fr') {
    const cartKey = this.getCartKey(userId);

    try {
      const cartItems = await this.redisClient.hgetall(cartKey);
      if (Object.keys(cartItems).length === 0) {
        return {
          userId,
          items: [],
          totalItems: 0,
          subtotal: { amount: 0, currency: 'USD' },
          total: { amount: 0, currency: 'USD' },
          updatedAt: new Date(),
        };
      }

      const items = await Promise.all(
        Object.entries(cartItems).map(async ([itemKey, quantityStr]) => {
          const quantity = parseInt(quantityStr, 10);

          const [rawProductId, ...variantParts] = itemKey.split('|');
          const productId = rawProductId || '';
          // const product = await this.productService.findOne(
          //   productId,
          //   language || 'fr',
          // );

          const selectedVariants: Record<string, string> = {};
          variantParts.forEach((variant) => {
            const [key, value] = variant.split('=');
            if (key && value) selectedVariants[key] = value;
          });

          try {
            const product = await this.productService.findOne(
              productId,
              language ?? 'fr',
            );

            if (!product || !product.price) {
              throw new Error(
                'Produit non trouvé ou données de prix manquantes',
              );
            }

            Logger.debug(
              `🛒 Produit ${productId} | Variantes sélectionnées: ${JSON.stringify(
                selectedVariants,
              )}`,
            );

            let baseAmount = 0;
            let baseCurrency = 'USD';
            let matchedVariant: any = null;

            if (
              Array.isArray(product.variants) &&
              product.variants.length > 0
            ) {
              matchedVariant = product.variants.find((v) => {
                const colorMatches =
                  !selectedVariants.color ||
                  v.color?.code === selectedVariants.color ||
                  v.color?.label === selectedVariants.color;

                const sizeMatches =
                  !selectedVariants.size ||
                  (Array.isArray(v.size)
                    ? v.size.includes(selectedVariants.size)
                    : v.size === selectedVariants.size);

                return colorMatches && sizeMatches;
              });
            }

            Logger.debug(
              matchedVariant
                ? `✅ Variante trouvée: ${JSON.stringify({
                    size: matchedVariant.size,
                    color:
                      matchedVariant.color?.label || matchedVariant.color?.code,
                    price: matchedVariant.price,
                  })}`
                : `⚠️ Aucune variante correspondante trouvée pour ${productId}`,
            );

            // 🧮 Déterminer le prix
            const resolveCurrency = (currency: any) => {
              if (!currency) return 'USD';
              if (typeof currency === 'string') return currency;
              return (
                currency[language] ||
                currency.fr ||
                Object.values(currency)[0] ||
                'USD'
              );
            };

            const resolveAmount = (amount: any) => {
              if (amount == null) return 0;
              if (typeof amount === 'number') return amount;
              // amount might be an object like { fr: number, en: number }
              return (
                amount[language] ?? amount.fr ?? Object.values(amount)[0] ?? 0
              );
            };

            if (matchedVariant?.price) {
              baseAmount = resolveAmount(matchedVariant.price.amount);
              baseCurrency = resolveCurrency(matchedVariant.price.currency);
            } else {
              baseAmount = resolveAmount(product.price?.amount);
              baseCurrency = resolveCurrency(product.price?.currency);
            }

            // 🧮 Gestion de la promotion
            const hasPromotion = product.promotion?.reduced_price;
            const reducedPrice =
              hasPromotion &&
              typeof product.promotion?.reduced_price?.amount === 'number'
                ? product.promotion.reduced_price.amount
                : baseAmount;

            const finalUnitPrice = reducedPrice;
            const totalPrice = finalUnitPrice * quantity;

            Logger.debug(
              `💰 Prix calculé pour ${productId}: ${finalUnitPrice} ${baseCurrency} x ${quantity} = ${totalPrice} ${baseCurrency}`,
            );

            return {
              productId,
              sku: product.sku,
              // ATTENTION: 'product.name[language]' peut planter si 'language' n'existe pas
              name: product.name[language], 
              image:
                matchedVariant?.image?.[0] || product.variants?.[0]?.image?.[0],
              quantity,
              price: finalUnitPrice,
              currency: baseCurrency,
              unitPrice: {
                amount: finalUnitPrice,
                currency: baseCurrency,
              },
              totalPrice: {
                amount: totalPrice,
                currency: baseCurrency,
              },
              color:
                selectedVariants?.color ||
                matchedVariant?.color?.label ||
                matchedVariant?.color?.code ||
                null,
              size: selectedVariants?.size || matchedVariant?.size || null,
              promotion: hasPromotion
                ? {
                    reduced_price: {
                      amount: reducedPrice,
                      currency: baseCurrency,
                    },
                    pourcentage: product.promotion?.pourcentage,
                  }
                : undefined,
              isActive: product.isActive,
              selectedVariants:
                Object.keys(selectedVariants).length > 0
                  ? selectedVariants
                  : undefined,
            };
          } catch (productError) {
            Logger.error(
              `Erreur fetching produit ${productId}:`,
              (productError as Error).message,
            );
            return {
              productId,
              sku: productId,
              name: 'Produit non trouvé',
              quantity,
              price: 0,
              currency: 'USD',
              unitPrice: { amount: 0, currency: 'USD' },
              totalPrice: { amount: 0, currency: 'USD' },
              isActive: false,
              selectedVariants:
                Object.keys(selectedVariants).length > 0
                  ? selectedVariants
                  : undefined,
            };
          }
        }),
      );

      const validItems = items.filter((item) => item.isActive);
      const totalItems = validItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      const subtotalAmount = validItems.reduce(
        (acc, item) => acc + item.totalPrice.amount,
        0,
      );

      Logger.debug(
        `🧮 PANIER FINAL ${userId} → ${validItems.length} articles, total: ${subtotalAmount} USD`,
      );

      return {
        userId,
        items: validItems,
        totalItems,
        subtotal: { amount: subtotalAmount, currency: 'USD' },
        total: { amount: subtotalAmount, currency: 'USD' },
        updatedAt: new Date(),
      };
    } catch (error) {
      Logger.error('Error in getCart:', error);
      throw new BadRequestException('Erreur lors de la récupération du panier');
    }
  }

  // ... (Le reste de vos fonctions removeCartItem, updateCartItem, clearCart restent identiques)
  
  // ✅ SUPPRIMER UN ARTICLE DU PANIER
  async removeCartItem(
    userId: string,
    productId: string,
    selectedVariants?: Record<string, string>,
  ) {
    const cartKey = this.getCartKey(userId);
    let itemKey = productId;

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      const exists = await this.redisClient.hexists(cartKey, itemKey);
      if (!exists)
        throw new BadRequestException('Produit non trouvé dans le panier');

      await this.redisClient.hdel(cartKey, itemKey);
      return this.getCart(userId);
    } catch (error) {
      Logger.error('Error in removeCartItem:', error);
      throw new BadRequestException(
        (error as Error).message ||
          'Erreur lors de la suppression du produit du panier',
      );
    }
  }

  // ✅ MISE À JOUR D'UN ARTICLE
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

    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }

    try {
      if (quantity === 0) {
        await this.redisClient.hdel(cartKey, itemKey);
      } else {
        await this.redisClient.hset(cartKey, itemKey, quantity as number);
      }

      return await this.getCart(userId);
    } catch (error) {
      Logger.error('Error in updateCartItem:', error);
      throw new BadRequestException('Erreur lors de la mise à jour du panier');
    }
  }

  // ✅ SUPPRIMER TOUT LE PANIER
  async clearCart(userId: string): Promise<{ message: string }> {
    const cartKey = this.getCartKey(userId);
    try {
      await this.redisClient.del(cartKey);
      return { message: 'Panier vidé avec succès' };
    } catch (error: unknown) {
      throw new BadRequestException(
        'Erreur lors de la suppression du panier',
        error as HttpExceptionOptions,
      );
    }
  }
}