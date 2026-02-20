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
exports.WishlistsService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_constants_1 = require("../../shared/redis/redis.constants");
let WishlistsService = class WishlistsService {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    getWishlistKey(userId) {
        return `wishlist:user:${userId}`;
    }
    async addToWishlist(userId, productId) {
        const wishlistKey = this.getWishlistKey(userId);
        try {
            const added = await this.redisClient.sadd(wishlistKey, productId);
            await this.redisClient.expire(wishlistKey, 90 * 24 * 60 * 60);
            return {
                message: added === 1
                    ? 'Produit ajouté à la wishlist'
                    : 'Produit déjà dans la wishlist',
                added: added === 1,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || "Erreur lors de l'ajout à la wishlist");
        }
    }
    async getWishlist(userId) {
        const wishlistKey = this.getWishlistKey(userId);
        try {
            const productIds = await this.redisClient.smembers(wishlistKey);
            return {
                userId,
                productIds,
                totalItems: productIds.length,
                updatedAt: new Date(),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message ||
                'Erreur lors de la récupération de la wishlist');
        }
    }
    async removeFromWishlist(userId, productId) {
        const wishlistKey = this.getWishlistKey(userId);
        try {
            const removed = await this.redisClient.srem(wishlistKey, productId);
            return {
                message: removed === 1
                    ? 'Produit supprimé de la wishlist'
                    : 'Produit non trouvé dans la wishlist',
                removed: removed === 1,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message ||
                'Erreur lors de la suppression de la wishlist');
        }
    }
    async clearWishlist(userId) {
        const wishlistKey = this.getWishlistKey(userId);
        try {
            await this.redisClient.del(wishlistKey);
            return { message: 'Wishlist vidée avec succès' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message ||
                'Erreur lors de la suppression de la wishlist');
        }
    }
    async isInWishlist(userId, productId) {
        const wishlistKey = this.getWishlistKey(userId);
        try {
            const exists = await this.redisClient.sismember(wishlistKey, productId);
            return exists === 1;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message ||
                'Erreur lors de la vérification de la wishlist');
        }
    }
};
exports.WishlistsService = WishlistsService;
exports.WishlistsService = WishlistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], WishlistsService);
//# sourceMappingURL=wishlists.service.js.map