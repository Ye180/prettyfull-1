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
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const update_product_dto_1 = require("./dto/update-product.dto");
const products_service_1 = require("./products.service");
let ProductsController = ProductsController_1 = class ProductsController {
    productsService;
    logger = new common_1.Logger(ProductsController_1.name);
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(page = 1, limit = 10, language = 'fr') {
        return this.productsService.findAll(page, limit, language);
    }
    async findByCategorySlug(slug, language = 'fr') {
        return this.productsService.findByCategorySlug(slug, language);
    }
    async findOne(id, language = 'fr') {
        return this.productsService.findOne(id, language);
    }
    async findOneBySlug(slug, language = 'fr') {
        return this.productsService.findOneBySlug(slug, language);
    }
    async initCreate(payload) {
        if (!payload?.name || !payload?.description) {
            throw new common_1.BadRequestException('name and description are required');
        }
        return this.productsService.initCreate(payload);
    }
    async addVariants(files, variants = [], productId) {
        let parsedVariants = variants;
        if (typeof parsedVariants === 'string') {
            try {
                parsedVariants = JSON.parse(parsedVariants);
            }
            catch {
                throw new common_1.BadRequestException('Invalid JSON for variants');
            }
        }
        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
            throw new common_1.BadRequestException('variants array is required and cannot be empty');
        }
        return this.productsService.addVariants({
            productId,
            variants: parsedVariants,
            files,
        });
    }
    async update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    async remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    openapi.ApiOperation({ summary: "GET /products - Public\nListe tous les produits avec pagination" }),
    (0, common_1.Get)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/category/:slug'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByCategorySlug", null);
__decorate([
    openapi.ApiOperation({ summary: "GET /products/:id - Public\nR\u00E9cup\u00E8re un produit par son ID" }),
    (0, common_1.Get)(':id'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slugname/:slug'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOneBySlug", null);
__decorate([
    openapi.ApiOperation({ summary: "POST /products - Admin only\nCr\u00E9e un nouveau produit avec upload d'images" }),
    (0, common_1.Post)('init-create-product'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "initCreate", null);
__decorate([
    openapi.ApiOperation({ summary: "PATCH /products/add-product-variant/:id\nAdd one or more variants (no images) to an existing product\nbody: { variants: VariableProductDto[] }" }),
    (0, common_1.Post)('add-product-variant/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('variants')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addVariants", null);
__decorate([
    openapi.ApiOperation({ summary: "PATCH /products/:id - Admin only\nMet \u00E0 jour un produit" }),
    (0, common_1.Patch)(':id'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    openapi.ApiOperation({ summary: "DELETE /products/:id - Admin only\nSupprime un produit (soft delete)" }),
    (0, common_1.Delete)(':id'),
    (0, nestjs_better_auth_1.Roles)(['admin']),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map