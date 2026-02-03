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
var CartsServiceV2_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsServiceV2 = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ioredis_1 = require("ioredis");
const mongoose_2 = require("mongoose");
const redis_constants_1 = require("../../shared/redis/redis.constants");
const products_service_1 = require("../products/products.service");
const carts_schema_1 = require("./schemas/carts.schema");
let CartsServiceV2 = CartsServiceV2_1 = class CartsServiceV2 {
    redisClient;
    cartModel;
    productService;
    logger = new common_1.Logger(CartsServiceV2_1.name);
    CART_TTL = 30 * 24 * 60 * 60;
    constructor(redisClient, cartModel, productService) {
        this.redisClient = redisClient;
        this.cartModel = cartModel;
        this.productService = productService;
    }
    getCartKey(userId) {
        return `cart:user:${userId}`;
    }
    generateItemKey(productId, selectedVariants) {
        let itemKey = productId;
        if (selectedVariants && Object.keys(selectedVariants).length > 0) {
            const variants = Object.entries(selectedVariants)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}=${value}`)
                .join('|');
            itemKey = `${productId}|${variants}`;
        }
        return itemKey;
    }
    parseItemKey(itemKey) {
        const [rawProductId, ...variantParts] = itemKey.split('|');
        const productId = rawProductId || '';
        const selectedVariants = {};
        variantParts.forEach((variant) => {
            const [key, value] = variant.split('=');
            if (key && value)
                selectedVariants[key] = value;
        });
        return { productId, selectedVariants };
    }
    async syncToMongoDB(userId) {
        try {
            const cartKey = this.getCartKey(userId);
            const cartItems = await this.redisClient.hgetall(cartKey);
            if (Object.keys(cartItems).length === 0) {
                await this.cartModel.findOneAndDelete({ user: userId });
                this.logger.debug(`🗑️  MongoDB: Panier supprimé pour user ${userId}`);
                return;
            }
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
            await this.cartModel.findOneAndUpdate({ user: userId }, {
                $set: {
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                    updatedAt: new Date(),
                },
            }, { upsert: true, new: true });
            this.logger.debug(`✅ MongoDB: Panier synchronisé pour user ${userId}`);
        }
        catch (error) {
            this.logger.error(`❌ Erreur sync MongoDB pour user ${userId}:`, error);
        }
    }
    async getCart(userId, language = 'fr') {
        const cartKey = this.getCartKey(userId);
        try {
            const cartItems = await this.redisClient.hgetall(cartKey);
            if (Object.keys(cartItems).length === 0) {
                this.logger.debug(`🔄 Redis miss → Fallback MongoDB pour user ${userId}`);
                return await this.getCartFromMongoDB(userId, language);
            }
            const items = await this.buildCartItems(cartItems, language);
            const validItems = items.filter((item) => item.isActive);
            const totalItems = validItems.reduce((acc, item) => acc + item.quantity, 0);
            const subtotalAmount = validItems.reduce((acc, item) => acc + item.totalPrice.amount, 0);
            return {
                userId,
                items: validItems,
                totalItems,
                subtotal: { amount: subtotalAmount, currency: 'USD' },
                total: { amount: subtotalAmount, currency: 'USD' },
                updatedAt: new Date(),
                source: 'redis',
            };
        }
        catch (error) {
            this.logger.error(`❌ Erreur Redis getCart, fallback MongoDB:`, error);
            return await this.getCartFromMongoDB(userId, language);
        }
    }
    async getCartFromMongoDB(userId, language = 'fr') {
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
            const cartKey = this.getCartKey(userId);
            const pipeline = this.redisClient.pipeline();
            cart.items.forEach((item) => {
                const selectedVariants = {};
                if (item.color)
                    selectedVariants.color = JSON.stringify(item.color);
                if (item.size)
                    selectedVariants.size = item.size;
                const itemKey = this.generateItemKey(item.productId, selectedVariants);
                pipeline.hset(cartKey, itemKey, String(item.quantity));
            });
            pipeline.expire(cartKey, this.CART_TTL);
            await pipeline.exec();
            this.logger.debug(`✅ Redis populated from MongoDB pour user ${userId}`);
            const cartItemsMap = {};
            cart.items.forEach((item) => {
                const selectedVariants = {};
                if (item.color)
                    selectedVariants.color = JSON.stringify(item.color);
                if (item.size)
                    selectedVariants.size = item.size;
                const itemKey = this.generateItemKey(item.productId, selectedVariants);
                cartItemsMap[itemKey] = String(item.quantity);
            });
            const items = await this.buildCartItems(cartItemsMap, language);
            const validItems = items.filter((item) => item.isActive);
            const totalItems = validItems.reduce((acc, item) => acc + item.quantity, 0);
            const subtotalAmount = validItems.reduce((acc, item) => acc + item.totalPrice.amount, 0);
            return {
                userId,
                items: validItems,
                totalItems,
                subtotal: { amount: subtotalAmount, currency: 'USD' },
                total: { amount: subtotalAmount, currency: 'USD' },
                updatedAt: new Date(),
                source: 'mongodb',
            };
        }
        catch (error) {
            this.logger.error(`❌ Erreur MongoDB getCart:`, error);
            throw new common_1.BadRequestException('Erreur lors de la récupération du panier');
        }
    }
    async buildCartItems(cartItems, language) {
        const items = await Promise.all(Object.entries(cartItems).map(async ([itemKey, quantityStr]) => {
            const quantity = parseInt(quantityStr, 10);
            const { productId, selectedVariants } = this.parseItemKey(itemKey);
            try {
                const product = await this.productService.findOne(productId, language ?? 'fr');
                if (!product || !product.price) {
                    throw new Error('Produit non trouvé ou prix manquant');
                }
                let matchedVariant = null;
                if (Array.isArray(product.variants) && product.variants.length > 0) {
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
                let baseAmount = 0;
                let baseCurrency = 'USD';
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
                const resolveName = (name) => {
                    if (typeof name === 'string')
                        return name;
                    return (name?.[language] || name?.fr || name?.en || 'Produit sans nom');
                };
                return {
                    productId,
                    sku: product.sku,
                    name: resolveName(product.name),
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
                this.logger.error(`Erreur fetching produit ${productId}:`, productError);
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
        return items;
    }
    async addToCart(userId, language, addToCartDto) {
        const { productId, quantity, selectedVariants } = addToCartDto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException('La quantité doit être supérieure à 0');
        }
        const cartKey = this.getCartKey(userId);
        const itemKey = this.generateItemKey(productId, selectedVariants);
        try {
            await this.redisClient.hincrby(cartKey, itemKey, quantity);
            await this.redisClient.expire(cartKey, this.CART_TTL);
            this.logger.debug(`✅ Redis: Article ajouté au panier user ${userId}`);
            setImmediate(() => {
                void this.syncToMongoDB(userId);
            });
            return await this.getCart(userId, language);
        }
        catch (error) {
            this.logger.error("Erreur lors de l'ajout au panier:", error);
            throw new common_1.BadRequestException("Erreur lors de l'ajout au panier");
        }
    }
    async updateCartItem(userId, productId, updateCartItemDto, language = 'fr') {
        const { quantity, selectedVariants } = updateCartItemDto;
        const cartKey = this.getCartKey(userId);
        const itemKey = this.generateItemKey(productId, selectedVariants);
        try {
            if (quantity !== undefined && quantity <= 0) {
                await this.redisClient.hdel(cartKey, itemKey);
                this.logger.debug(`🗑️  Redis: Article supprimé du panier user ${userId}`);
            }
            else if (quantity !== undefined) {
                await this.redisClient.hset(cartKey, itemKey, quantity.toString());
                this.logger.debug(`✅ Redis: Quantité mise à jour pour user ${userId}`);
            }
            await this.redisClient.expire(cartKey, this.CART_TTL);
            setImmediate(() => {
                void this.syncToMongoDB(userId);
            });
            return await this.getCart(userId, language);
        }
        catch (error) {
            this.logger.error('Erreur lors de la mise à jour du panier:', error);
            throw new common_1.BadRequestException('Erreur lors de la mise à jour du panier');
        }
    }
    async removeCartItem(userId, productId, selectedVariants, language = 'fr') {
        const cartKey = this.getCartKey(userId);
        const itemKey = this.generateItemKey(productId, selectedVariants);
        try {
            await this.redisClient.hdel(cartKey, itemKey);
            this.logger.debug(`🗑️  Redis: Article supprimé du panier user ${userId}`);
            setImmediate(() => {
                void this.syncToMongoDB(userId);
            });
            return await this.getCart(userId, language);
        }
        catch (error) {
            this.logger.error('Erreur lors de la suppression:', error);
            throw new common_1.BadRequestException("Erreur lors de la suppression de l'article");
        }
    }
    async clearCart(userId) {
        const cartKey = this.getCartKey(userId);
        try {
            await this.redisClient.del(cartKey);
            this.logger.debug(`🗑️  Redis: Panier vidé pour user ${userId}`);
            setImmediate(() => {
                void this.syncToMongoDB(userId);
            });
            return { message: 'Panier vidé avec succès' };
        }
        catch (error) {
            this.logger.error('Erreur lors du vidage du panier:', error);
            throw new common_1.BadRequestException('Erreur lors du vidage du panier');
        }
    }
    async forceSync(userId) {
        try {
            await this.syncToMongoDB(userId);
            return {
                message: 'Synchronisation forcée avec succès',
                success: true,
            };
        }
        catch (error) {
            this.logger.error('Erreur lors de la sync forcée:', error);
            return {
                message: 'Erreur lors de la synchronisation',
                success: false,
            };
        }
    }
};
exports.CartsServiceV2 = CartsServiceV2;
exports.CartsServiceV2 = CartsServiceV2 = CartsServiceV2_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __param(1, (0, mongoose_1.InjectModel)(carts_schema_1.Cart.name)),
    __metadata("design:paramtypes", [ioredis_1.Redis,
        mongoose_2.Model,
        products_service_1.ProductsService])
], CartsServiceV2);
//# sourceMappingURL=carts.service.v2.js.map