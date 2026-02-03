"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_constants_1 = require("../../shared/redis/redis.constants");
const products_service_1 = require("../products/products.service");
let CartsService = class CartsService {
    redisClient;
    productService;
    constructor(redisClient, productService) {
        this.redisClient = redisClient;
        this.productService = productService;
    }
    getCartKey(userId) {
        return `cart:user:${userId}`;
    }
    async addToCart(userId, language, addToCartDto) {
        const { productId, quantity, selectedVariants } = addToCartDto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException('La quantité doit être supérieure à 0');
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
            await this.redisClient.hincrby(cartKey, itemKey, quantity);
            await this.redisClient.expire(cartKey, 30 * 24 * 60 * 60);
            return { success: true };
        }
        catch (error) {
            common_1.Logger.error("Erreur Redis lors de l'ajout au panier:", error.stack);
            throw new common_1.BadRequestException("Erreur lors de l'ajout au panier");
        }
    }
    async getCart(userId, language = 'fr') {
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
            const items = await Promise.all(Object.entries(cartItems).map(async ([itemKey, quantityStr]) => {
                const quantity = parseInt(quantityStr, 10);
                const [rawProductId, ...variantParts] = itemKey.split('|');
                const productId = rawProductId || '';
                const selectedVariants = {};
                variantParts.forEach((variant) => {
                    const [key, value] = variant.split('=');
                    if (key && value)
                        selectedVariants[key] = value;
                });
                try {
                    const product = await this.productService.findOne(productId, language ?? 'fr');
                    if (!product || !product.price) {
                        throw new Error('Produit non trouvé ou données de prix manquantes');
                    }
                    common_1.Logger.debug(`🛒 Produit ${productId} | Variantes sélectionnées: ${JSON.stringify(selectedVariants)}`);
                    let baseAmount = 0;
                    let baseCurrency = 'USD';
                    let matchedVariant = null;
                    if (Array.isArray(product.variants) &&
                        product.variants.length > 0) {
                        matchedVariant = product.variants.find((v) => {
                            const colorMatches = !selectedVariants.color ||
                                v.color?.code === selectedVariants.color ||
                                v.color?.label === selectedVariants.color;
                            const sizeMatches = !selectedVariants.size ||
                                (Array.isArray(v.size)
                                    ? v.size.includes(selectedVariants.size)
                                    : v.size === selectedVariants.size);
                            return colorMatches && sizeMatches;
                        });
                    }
                    common_1.Logger.debug(matchedVariant
                        ? `✅ Variante trouvée: ${JSON.stringify({
                            size: matchedVariant.size,
                            color: matchedVariant.color?.label || matchedVariant.color?.code,
                            price: matchedVariant.price,
                        })}`
                        : `⚠️ Aucune variante correspondante trouvée pour ${productId}`);
                    const resolveCurrency = (currency) => {
                        if (!currency)
                            return 'USD';
                        if (typeof currency === 'string')
                            return currency;
                        return (currency[language] ||
                            currency.fr ||
                            Object.values(currency)[0] ||
                            'USD');
                    };
                    const resolveAmount = (amount) => {
                        if (amount == null)
                            return 0;
                        if (typeof amount === 'number')
                            return amount;
                        return (amount[language] ?? amount.fr ?? Object.values(amount)[0] ?? 0);
                    };
                    if (matchedVariant?.price) {
                        baseAmount = resolveAmount(matchedVariant.price.amount);
                        baseCurrency = resolveCurrency(matchedVariant.price.currency);
                    }
                    else {
                        baseAmount = resolveAmount(product.price?.amount);
                        baseCurrency = resolveCurrency(product.price?.currency);
                    }
                    const hasPromotion = product.promotion?.reduced_price;
                    const reducedPrice = hasPromotion &&
                        typeof product.promotion?.reduced_price?.amount === 'number'
                        ? product.promotion.reduced_price.amount
                        : baseAmount;
                    const finalUnitPrice = reducedPrice;
                    const totalPrice = finalUnitPrice * quantity;
                    common_1.Logger.debug(`💰 Prix calculé pour ${productId}: ${finalUnitPrice} ${baseCurrency} x ${quantity} = ${totalPrice} ${baseCurrency}`);
                    return {
                        productId,
                        sku: product.sku,
                        name: product.name[language],
                        image: matchedVariant?.image?.[0] || product.variants?.[0]?.image?.[0],
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
                        color: selectedVariants?.color ||
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
                        selectedVariants: Object.keys(selectedVariants).length > 0
                            ? selectedVariants
                            : undefined,
                    };
                }
                catch (productError) {
                    common_1.Logger.error(`Erreur fetching produit ${productId}:`, productError.message);
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
                        selectedVariants: Object.keys(selectedVariants).length > 0
                            ? selectedVariants
                            : undefined,
                    };
                }
            }));
            const validItems = items.filter((item) => item.isActive);
            const totalItems = validItems.reduce((acc, item) => acc + item.quantity, 0);
            const subtotalAmount = validItems.reduce((acc, item) => acc + item.totalPrice.amount, 0);
            common_1.Logger.debug(`🧮 PANIER FINAL ${userId} → ${validItems.length} articles, total: ${subtotalAmount} USD`);
            return {
                userId,
                items: validItems,
                totalItems,
                subtotal: { amount: subtotalAmount, currency: 'USD' },
                total: { amount: subtotalAmount, currency: 'USD' },
                updatedAt: new Date(),
            };
        }
        catch (error) {
            common_1.Logger.error('Error in getCart:', error);
            throw new common_1.BadRequestException('Erreur lors de la récupération du panier');
        }
    }
    async removeCartItem(userId, productId, selectedVariants) {
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
                throw new common_1.BadRequestException('Produit non trouvé dans le panier');
            await this.redisClient.hdel(cartKey, itemKey);
            return this.getCart(userId);
        }
        catch (error) {
            common_1.Logger.error('Error in removeCartItem:', error);
            throw new common_1.BadRequestException(error.message ||
                'Erreur lors de la suppression du produit du panier');
        }
    }
    async updateCartItem(userId, productId, updateCartItemDto) {
        const { quantity, selectedVariants } = updateCartItemDto;
        if (quantity < 0) {
            throw new common_1.BadRequestException('La quantité ne peut pas être négative');
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
            }
            else {
                await this.redisClient.hset(cartKey, itemKey, quantity);
            }
            return await this.getCart(userId);
        }
        catch (error) {
            common_1.Logger.error('Error in updateCartItem:', error);
            throw new common_1.BadRequestException('Erreur lors de la mise à jour du panier');
        }
    }
    async clearCart(userId) {
        const cartKey = this.getCartKey(userId);
        try {
            await this.redisClient.del(cartKey);
            return { message: 'Panier vidé avec succès' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erreur lors de la suppression du panier', error);
        }
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis,
        products_service_1.ProductsService])
], CartsService);
//# sourceMappingURL=carts.service.js.map