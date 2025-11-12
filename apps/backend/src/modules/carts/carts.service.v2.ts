import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Redis } from 'ioredis';
import { Model } from 'mongoose';
import { REDIS_CLIENT } from '../../shared/redis/redis.constants';
import { ProductsService } from '../products/products.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { Cart } from './schemas/carts.schema';

/**
 * ============================================================================
 * CART SERVICE V2 - PRODUCTION READY
 * ============================================================================
 *
 * Architecture Hybride Redis + MongoDB Fallback
 *
 * Stratégie:
 * - Redis: Cache primaire pour performances optimales
 * - MongoDB: Persistance permanente et fallback en cas de panne Redis
 *
 * Flux de données:
 * 1. Lecture: Redis → (miss) → MongoDB → Populate Redis
 * 2. Écriture: Redis + Async MongoDB sync
 *
 * Corrections bugs:
 * - ✅ Icon panier: Retour systématique du cart complet après mutation
 * - ✅ Slow loading: Redis cache + MongoDB indexes
 * - ✅ Wrong products/prices: Validation stricte + refresh automatique
 * ============================================================================
 */

interface CartItemData {
  productId: string;
  sku: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  currency: string;
  unitPrice: { amount: number; currency: string };
  totalPrice: { amount: number; currency: string };
  color?: string | null;
  size?: string | null;
  promotion?: {
    reduced_price: { amount: number; currency: string };
    pourcentage?: number;
  };
  isActive: boolean;
  selectedVariants?: Record<string, string>;
}

export interface CartResponse {
  userId: string;
  items: CartItemData[];
  totalItems: number;
  subtotal: { amount: number; currency: string };
  total: { amount: number; currency: string };
  updatedAt: Date;
  source: 'redis' | 'mongodb' | 'hybrid';
}

@Injectable()
export class CartsServiceV2 {
  private readonly logger = new Logger(CartsServiceV2.name);
  private readonly CART_TTL = 30 * 24 * 60 * 60; // 30 jours

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly productService: ProductsService,
  ) {}

  /**
   * Génère la clé Redis pour un panier utilisateur
   */
  private getCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  /**
   * Génère une clé unique pour un item (produit + variantes)
   */
  private generateItemKey(
    productId: string,
    selectedVariants?: Record<string, string>,
  ): string {
    let itemKey = productId;
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const variants = Object.entries(selectedVariants)
        .sort(([a], [b]) => a.localeCompare(b)) // Tri pour consistance
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      itemKey = `${productId}|${variants}`;
    }
    return itemKey;
  }

  /**
   * Parse une clé d'item pour extraire productId et variantes
   */
  private parseItemKey(itemKey: string): {
    productId: string;
    selectedVariants: Record<string, string>;
  } {
    const [rawProductId, ...variantParts] = itemKey.split('|');
    const productId = rawProductId || '';

    const selectedVariants: Record<string, string> = {};
    variantParts.forEach((variant) => {
      const [key, value] = variant.split('=');
      if (key && value) selectedVariants[key] = value;
    });

    return { productId, selectedVariants };
  }

  /**
   * ============================================================================
   * SYNC REDIS → MONGODB (Async background task)
   * ============================================================================
   */
  private async syncToMongoDB(userId: string): Promise<void> {
    try {
      const cartKey = this.getCartKey(userId);
      const cartItems = await this.redisClient.hgetall(cartKey);

      if (Object.keys(cartItems).length === 0) {
        // Panier vide dans Redis, supprimer de MongoDB
        await this.cartModel.findOneAndDelete({ user: userId });
        this.logger.debug(`🗑️  MongoDB: Panier supprimé pour user ${userId}`);
        return;
      }

      // Construire le document MongoDB à partir de Redis
      const items = Object.entries(cartItems).map(([itemKey, quantityStr]) => {
        const { productId, selectedVariants } = this.parseItemKey(itemKey);
        const quantity = parseInt(quantityStr, 10);

        return {
          productId,
          quantity,
          selectedVariants: Object.keys(selectedVariants).length
            ? selectedVariants
            : undefined,
        };
      });

      // Upsert dans MongoDB
      await this.cartModel.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              // Autres champs seront peuplés lors du getCart
            })),
            updatedAt: new Date(),
          },
        },
        { upsert: true, new: true },
      );

      this.logger.debug(`✅ MongoDB: Panier synchronisé pour user ${userId}`);
    } catch (error) {
      this.logger.error(`❌ Erreur sync MongoDB pour user ${userId}:`, error);
      // Ne pas throw, c'est un processus async en background
    }
  }

  /**
   * ============================================================================
   * GET CART - avec fallback MongoDB
   * ============================================================================
   */
  async getCart(
    userId: string,
    language: string = 'fr',
  ): Promise<CartResponse> {
    const cartKey = this.getCartKey(userId);

    try {
      // 1. Essayer Redis d'abord (cache)
      const cartItems = await this.redisClient.hgetall(cartKey);

      if (Object.keys(cartItems).length === 0) {
        // 2. Fallback MongoDB si Redis vide
        this.logger.debug(
          `🔄 Redis miss → Fallback MongoDB pour user ${userId}`,
        );
        return await this.getCartFromMongoDB(userId, language);
      }

      // 3. Redis hit - Construire la réponse
      const items = await this.buildCartItems(cartItems, language);

      const validItems = items.filter((item) => item.isActive);
      const totalItems = validItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      const subtotalAmount = validItems.reduce(
        (acc, item) => acc + item.totalPrice.amount,
        0,
      );

      return {
        userId,
        items: validItems,
        totalItems,
        subtotal: { amount: subtotalAmount, currency: 'USD' },
        total: { amount: subtotalAmount, currency: 'USD' },
        updatedAt: new Date(),
        source: 'redis',
      };
    } catch (error) {
      this.logger.error(`❌ Erreur Redis getCart, fallback MongoDB:`, error);
      // Fallback MongoDB en cas d'erreur Redis
      return await this.getCartFromMongoDB(userId, language);
    }
  }

  /**
   * Récupère le panier depuis MongoDB et populate Redis
   */
  private async getCartFromMongoDB(
    userId: string,
    language: string = 'fr',
  ): Promise<CartResponse> {
    try {
      const cart = await this.cartModel
        .findOne({ user: userId, isActive: true })
        .lean()
        .exec();

      if (!cart || !cart.items || cart.items.length === 0) {
        return {
          userId,
          items: [],
          totalItems: 0,
          subtotal: { amount: 0, currency: 'USD' },
          total: { amount: 0, currency: 'USD' },
          updatedAt: new Date(),
          source: 'mongodb',
        };
      }

      // Populate Redis avec les données MongoDB
      const cartKey = this.getCartKey(userId);
      const pipeline = this.redisClient.pipeline();

      cart.items.forEach((item) => {
        const selectedVariants: Record<string, string> = {};
        if (item.color) selectedVariants.color = JSON.stringify(item.color);
        if (item.size) selectedVariants.size = item.size;

        const itemKey = this.generateItemKey(item.productId, selectedVariants);
        pipeline.hset(cartKey, itemKey, String(item.quantity));
      });

      pipeline.expire(cartKey, this.CART_TTL);
      await pipeline.exec();

      this.logger.debug(`✅ Redis populated from MongoDB pour user ${userId}`);

      // Construire la réponse
      const cartItemsMap: Record<string, string> = {};
      cart.items.forEach((item) => {
        const selectedVariants: Record<string, string> = {};
        if (item.color) selectedVariants.color = JSON.stringify(item.color);
        if (item.size) selectedVariants.size = item.size;

        const itemKey = this.generateItemKey(item.productId, selectedVariants);
        cartItemsMap[itemKey] = String(item.quantity);
      });

      const items = await this.buildCartItems(cartItemsMap, language);
      const validItems = items.filter((item) => item.isActive);
      const totalItems = validItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      const subtotalAmount = validItems.reduce(
        (acc, item) => acc + item.totalPrice.amount,
        0,
      );

      return {
        userId,
        items: validItems,
        totalItems,
        subtotal: { amount: subtotalAmount, currency: 'USD' },
        total: { amount: subtotalAmount, currency: 'USD' },
        updatedAt: new Date(),
        source: 'mongodb',
      };
    } catch (error) {
      this.logger.error(`❌ Erreur MongoDB getCart:`, error);
      throw new BadRequestException('Erreur lors de la récupération du panier');
    }
  }

  /**
   * Construit les items du panier avec les données produits
   */
  private async buildCartItems(
    cartItems: Record<string, string>,
    language: string,
  ): Promise<CartItemData[]> {
    const items = await Promise.all(
      Object.entries(cartItems).map(async ([itemKey, quantityStr]) => {
        const quantity = parseInt(quantityStr, 10);
        const { productId, selectedVariants } = this.parseItemKey(itemKey);

        try {
          const product = await this.productService.findOne(
            productId,
            language ?? 'fr',
          );

          if (!product || !product.price) {
            throw new Error('Produit non trouvé ou prix manquant');
          }

          // Trouver la variante correspondante
          let matchedVariant: any = null;
          if (Array.isArray(product.variants) && product.variants.length > 0) {
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

          // Résoudre le prix (avec gestion langue et type)
          const resolveCurrency = (currency: any): string => {
            if (!currency) return 'USD';
            if (typeof currency === 'string') return currency;
            return (
              currency[language] ||
              currency.fr ||
              Object.values(currency)[0] ||
              'USD'
            );
          };

          const resolveAmount = (amount: any): number => {
            if (amount == null) return 0;
            if (typeof amount === 'number') return amount;
            return (
              amount[language] ?? amount.fr ?? Object.values(amount)[0] ?? 0
            );
          };

          let baseAmount = 0;
          let baseCurrency = 'USD';

          if (matchedVariant?.price) {
            baseAmount = resolveAmount(matchedVariant.price.amount);
            baseCurrency = resolveCurrency(matchedVariant.price.currency);
          } else {
            baseAmount = resolveAmount(product.price?.amount);
            baseCurrency = resolveCurrency(product.price?.currency);
          }

          // Gestion promotion
          const hasPromotion = product.promotion?.reduced_price;
          const reducedPrice =
            hasPromotion &&
            typeof product.promotion?.reduced_price?.amount === 'number'
              ? product.promotion.reduced_price.amount
              : baseAmount;

          const finalUnitPrice = reducedPrice;
          const totalPrice = finalUnitPrice * quantity;

          // Résoudre le nom (support ancien et nouveau format)
          const resolveName = (name: any): string => {
            if (typeof name === 'string') return name;
            return (
              name?.[language] || name?.fr || name?.en || 'Produit sans nom'
            );
          };

          return {
            productId,
            sku: product.sku,
            name: resolveName(product.name),
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
          this.logger.error(
            `Erreur fetching produit ${productId}:`,
            productError,
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

    return items;
  }

  /**
   * ============================================================================
   * ADD TO CART
   * ============================================================================
   */
  async addToCart(
    userId: string,
    language: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponse> {
    const { productId, quantity, selectedVariants } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('La quantité doit être supérieure à 0');
    }

    const cartKey = this.getCartKey(userId);
    const itemKey = this.generateItemKey(productId, selectedVariants);

    try {
      // 1. Ajouter à Redis
      await this.redisClient.hincrby(cartKey, itemKey, quantity);
      await this.redisClient.expire(cartKey, this.CART_TTL);

      this.logger.debug(`✅ Redis: Article ajouté au panier user ${userId}`);

      // 2. Sync MongoDB en background (non-bloquant)
      setImmediate(() => {
        void this.syncToMongoDB(userId);
      });

      // 3. Retourner le panier complet (fix bug icon)
      return await this.getCart(userId, language);
    } catch (error: unknown) {
      this.logger.error("Erreur lors de l'ajout au panier:", error);
      throw new BadRequestException("Erreur lors de l'ajout au panier");
    }
  }

  /**
   * ============================================================================
   * UPDATE CART ITEM
   * ============================================================================
   */
  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
    language: string = 'fr',
  ): Promise<CartResponse> {
    const { quantity, selectedVariants } = updateCartItemDto;
    const cartKey = this.getCartKey(userId);
    const itemKey = this.generateItemKey(productId, selectedVariants);

    try {
      if (quantity !== undefined && quantity <= 0) {
        // Supprimer l'article si quantité = 0
        await this.redisClient.hdel(cartKey, itemKey);
        this.logger.debug(
          `🗑️  Redis: Article supprimé du panier user ${userId}`,
        );
      } else if (quantity !== undefined) {
        // Mettre à jour la quantité
        await this.redisClient.hset(cartKey, itemKey, quantity.toString());
        this.logger.debug(`✅ Redis: Quantité mise à jour pour user ${userId}`);
      }

      await this.redisClient.expire(cartKey, this.CART_TTL);

      // Sync MongoDB
      setImmediate(() => {
        void this.syncToMongoDB(userId);
      });

      return await this.getCart(userId, language);
    } catch (error) {
      this.logger.error('Erreur lors de la mise à jour du panier:', error);
      throw new BadRequestException('Erreur lors de la mise à jour du panier');
    }
  }

  /**
   * ============================================================================
   * REMOVE CART ITEM
   * ============================================================================
   */
  async removeCartItem(
    userId: string,
    productId: string,
    selectedVariants?: Record<string, string>,
    language: string = 'fr',
  ): Promise<CartResponse> {
    const cartKey = this.getCartKey(userId);
    const itemKey = this.generateItemKey(productId, selectedVariants);

    try {
      await this.redisClient.hdel(cartKey, itemKey);
      this.logger.debug(`🗑️  Redis: Article supprimé du panier user ${userId}`);

      // Sync MongoDB
      setImmediate(() => {
        void this.syncToMongoDB(userId);
      });

      return await this.getCart(userId, language);
    } catch (error) {
      this.logger.error('Erreur lors de la suppression:', error);
      throw new BadRequestException(
        "Erreur lors de la suppression de l'article",
      );
    }
  }

  /**
   * ============================================================================
   * CLEAR CART
   * ============================================================================
   */
  async clearCart(userId: string): Promise<{ message: string }> {
    const cartKey = this.getCartKey(userId);

    try {
      await this.redisClient.del(cartKey);
      this.logger.debug(`🗑️  Redis: Panier vidé pour user ${userId}`);

      // Sync MongoDB
      setImmediate(() => {
        void this.syncToMongoDB(userId);
      });

      return { message: 'Panier vidé avec succès' };
    } catch (error) {
      this.logger.error('Erreur lors du vidage du panier:', error);
      throw new BadRequestException('Erreur lors du vidage du panier');
    }
  }

  /**
   * ============================================================================
   * FORCE SYNC - Route admin pour forcer la synchronisation
   * ============================================================================
   */
  async forceSync(
    userId: string,
  ): Promise<{ message: string; success: boolean }> {
    try {
      await this.syncToMongoDB(userId);
      return {
        message: 'Synchronisation forcée avec succès',
        success: true,
      };
    } catch (error) {
      this.logger.error('Erreur lors de la sync forcée:', error);
      return {
        message: 'Erreur lors de la synchronisation',
        success: false,
      };
    }
  }
}
