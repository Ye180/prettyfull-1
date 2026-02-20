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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../../../modules/categories/categories.service");
const products_service_1 = require("../../../modules/products/products.service");
const constant_1 = require("./constant/constant");
let BootstrapService = class BootstrapService {
    productService;
    categoryService;
    constructor(productService, categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }
    async bootstrapCategories() {
    }
    async bootstrapProducts() {
        try {
            for (const product of constant_1.PRODUCTS) {
                try {
                    await this.productService.create(product);
                    common_1.Logger.log(`🎉 Produit "${product.name.en}" créé avec succès !`);
                    const existing = await this.productService.findOneBySlug(product.slug);
                    if (existing) {
                        common_1.Logger.log(`✅ Produit "${product.name.en}" déjà existant, aucune création nécessaire.`);
                        continue;
                    }
                }
                catch (err) {
                    common_1.Logger.error(`Failed to create product: ${product.name.en}`, err);
                }
            }
        }
        catch (error) {
            common_1.Logger.error(`❌ Erreur lors de la vérification de la catégorie: ${error.message}`);
        }
    }
    async bootstrapUsers() {
    }
    async run() {
        await this.bootstrapCategories();
        await this.bootstrapUsers();
    }
    async onApplicationBootstrap() {
        common_1.Logger.log('🚀 Bootstrap en cours...');
        await this.run();
        common_1.Logger.log('✅ Bootstrap terminé !');
    }
};
exports.BootstrapService = BootstrapService;
exports.BootstrapService = BootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        categories_service_1.CategoriesService])
], BootstrapService);
//# sourceMappingURL=bootstrap.service.js.map