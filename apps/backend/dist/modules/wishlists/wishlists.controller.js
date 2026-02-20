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
exports.WishlistsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const wishlists_service_1 = require("./wishlists.service");
let WishlistsController = class WishlistsController {
    wishlistsService;
    constructor(wishlistsService) {
        this.wishlistsService = wishlistsService;
    }
    async getWishlist(req) {
        const userId = req.user?.id || 'temp-user-id';
        return this.wishlistsService.getWishlist(userId);
    }
    async addToWishlist(req, productId) {
        const userId = req.user?.id || 'temp-user-id';
        return this.wishlistsService.addToWishlist(userId, productId);
    }
    async removeFromWishlist(req, productId) {
        const userId = req.user?.id || 'temp-user-id';
        return this.wishlistsService.removeFromWishlist(userId, productId);
    }
    async clearWishlist(req) {
        const userId = req.user?.id || 'temp-user-id';
        return this.wishlistsService.clearWishlist(userId);
    }
    async isInWishlist(req, productId) {
        const userId = req.user?.id || 'temp-user-id';
        const isInWishlist = await this.wishlistsService.isInWishlist(userId, productId);
        return { productId, isInWishlist };
    }
};
exports.WishlistsController = WishlistsController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Post)(':productId'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Delete)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "clearWishlist", null);
__decorate([
    (0, common_1.Get)('check/:productId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistsController.prototype, "isInWishlist", null);
exports.WishlistsController = WishlistsController = __decorate([
    (0, common_1.Controller)('wishlists'),
    __metadata("design:paramtypes", [wishlists_service_1.WishlistsService])
], WishlistsController);
//# sourceMappingURL=wishlists.controller.js.map