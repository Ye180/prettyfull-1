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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const format_response_1 = require("../../shared/utils/format-response");
const categories_service_1 = require("../categories/categories.service");
const storage_1 = require("../storage");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    storageService;
    categoriesService;
    constructor(productModel, storageService, categoriesService) {
        this.productModel = productModel;
        this.storageService = storageService;
        this.categoriesService = categoriesService;
    }
    async findAll(page = 1, limit = 10, language = 'fr') {
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.productModel
                .find({ isActive: true })
                .populate('category', 'name slug')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec(),
            this.productModel.countDocuments({ isActive: true }).exec(),
        ]);
        return {
            products: products.map((p) => this.transformProduct(p, language)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, language = 'en') {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de produit invalide');
        }
        const product = await this.productModel
            .findById(id)
            .populate('category', 'name slug')
            .lean()
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        return this.transformProduct(product, language);
    }
    async findOneBySlug(slug, language = 'fr') {
        if (slug.trim() === '') {
            throw new common_1.BadRequestException('Slug de produit invalide');
        }
        const product = await this.productModel
            .findOne({ slug: slug })
            .populate('category', 'name slug')
            .lean()
            .exec();
        const category = await this.categoriesService.findOne(product?.category, language);
        const newProduct = { ...product, category };
        if (!product) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        return this.transformProduct(newProduct, language);
    }
    async findByCategoryId(categoryId, language = 'fr') {
        if (!mongoose_2.Types.ObjectId.isValid(categoryId)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const products = await this.productModel
            .find({ category: categoryId, isActive: true })
            .lean()
            .exec();
        return products.map((product) => this.transformProduct(product, language));
    }
    async findByCategorySlug(categorySlug, language = 'fr') {
        const category = await this.categoriesService.findBySlug(categorySlug, language);
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        const products = await this.productModel
            .find({
            category: category.id.toString(),
            isActive: true,
        })
            .lean()
            .exec();
        return products.map((product) => this.transformProduct(product, language));
    }
    calculateTotalStock(product) {
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((total, variant) => {
                return total + (variant.quantity || 0);
            }, 0);
        }
        else if (product.notVariable) {
            return product.notVariable.quantity || 0;
        }
        return 0;
    }
    async create(createProductDto) {
        const product = new this.productModel({
            ...createProductDto,
            category: createProductDto.categoryId,
            price: {
                amount: {
                    fr: createProductDto.price.amount.fr,
                    en: createProductDto.price.amount.en,
                },
                currency: {
                    fr: createProductDto.price.currency.fr,
                    en: createProductDto.price.currency.en,
                },
            },
            promotion: createProductDto.promotion
                ? {
                    reduced_price: {
                        fr: {
                            amount: createProductDto.promotion.reduced_price.fr,
                            currency: createProductDto.price.currency.fr,
                        },
                        en: {
                            amount: createProductDto.promotion.reduced_price.en,
                            currency: createProductDto.price.currency.en,
                        },
                    },
                    pourcentage: createProductDto.promotion.pourcentage,
                }
                : undefined,
        });
        return product.save();
    }
    async update(id, updateProductDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de produit invalide');
        }
        const updateData = { ...updateProductDto };
        if (updateProductDto.categoryId) {
            updateData.category = updateProductDto.categoryId;
            delete updateData.categoryId;
        }
        if (updateProductDto.price) {
            if (updateProductDto.price.amount) {
                updateData.price = {
                    amount: {
                        fr: updateProductDto.price.amount.fr,
                        en: updateProductDto.price.amount.en,
                    },
                    currency: {
                        fr: updateProductDto.price.currency?.fr,
                        en: updateProductDto.price.currency?.en,
                    },
                };
            }
            else {
                updateData.price = {
                    amount: {
                        fr: updateProductDto.price.fr,
                        en: updateProductDto.price.en,
                    },
                    currency: {
                        fr: updateProductDto.price.currency ?? '',
                        en: updateProductDto.price.currency ?? '',
                    },
                };
            }
        }
        const product = await this.productModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        return product;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de produit invalide');
        }
        const result = await this.productModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        common_1.Logger.log(`Produit avec ID ${id} a été désactivé (soft delete).`);
        return (0, format_response_1.formatResponse)({
            data: result,
            message: 'Produit désactivé avec succès',
        });
    }
    async decrementStock(productId, quantity, selectedVariants, session) {
        const product = await this.productModel
            .findById(productId)
            .session(session)
            .exec();
        if (!product) {
            throw new common_1.NotFoundException(`Produit non trouvé: ${productId}`);
        }
        const productData = product;
        if (selectedVariants && Object.keys(selectedVariants).length > 0) {
            const variantIndex = productData.variants?.findIndex((v) => {
                return Object.entries(selectedVariants).every(([key, value]) => v[key]?.code === value || v[key] === value);
            });
            if (variantIndex === -1 || variantIndex === undefined) {
                throw new common_1.BadRequestException('Variante non trouvée');
            }
            const variant = productData.variants[variantIndex];
            if (variant.quantity < quantity) {
                throw new common_1.BadRequestException(`Stock insuffisant pour cette variante du produit ${productData.sku}`);
            }
            productData.variants[variantIndex].quantity -= quantity;
        }
        else {
            if (!productData.notVariable || !productData.notVariable.quantity) {
                throw new common_1.BadRequestException(`Produit simple sans stock: ${productData.sku}`);
            }
            if (productData.notVariable.quantity < quantity) {
                throw new common_1.BadRequestException(`Stock insuffisant pour le produit ${productData.sku}`);
            }
            productData.notVariable.quantity -= quantity;
        }
        productData.stock = this.calculateTotalStock(productData);
        const updatedProduct = await productData.save({
            session,
        });
        return updatedProduct;
    }
    async initCreate(payload) {
        const doc = {
            name: payload.name,
            description: payload.description,
            category: payload.categoryId || undefined,
            slug: payload.slug || undefined,
            sku: payload.sku || undefined,
            price: payload.price || {
                amount: { fr: 0, en: 0 },
                currency: { fr: '', en: '' },
            },
            isActive: payload.isActive ?? true,
            isFeatured: payload.isFeatured ?? false,
            variants: [],
            notVariable: payload.notVariable ? { ...payload.notVariable } : undefined,
            seoMeta: payload.seoMeta || {
                title: { fr: '', en: '' },
                description: { fr: '', en: '' },
                keywords: [],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const product = new this.productModel(doc);
        return product.save();
    }
    async addVariants({ productId, variants, images, files, }) {
        const uploadedFiles = files ?? images ?? [];
        if (!mongoose_2.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product id');
        }
        const product = await this.productModel.findById(productId).exec();
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const filesByField = {};
        uploadedFiles.forEach((f) => {
            if (!f || !f.fieldname)
                return;
            if (!filesByField[f.fieldname])
                filesByField[f.fieldname] = [];
            filesByField[f.fieldname]?.push(f);
        });
        common_1.Logger.log(`Files grouped by field: ${JSON.stringify(Object.keys(filesByField))}`);
        common_1.Logger.log(`Variants received: ${JSON.stringify(variants.map((v) => v.imageField))}`);
        const normalized = await Promise.all(variants.map(async (v, idx) => {
            const next = { ...v };
            if (next.images && next.images.length > 0) {
                delete next.imageField;
                return next;
            }
            const fieldName = next.imageField || `images_${idx}`;
            const filesForThisVariant = filesByField[fieldName] || [];
            if (filesForThisVariant.length > 0) {
                const uploaded = await this.storageService.uploadMultipleFiles(filesForThisVariant, 'products');
                next.images = uploaded.map((u) => u.url);
            }
            else {
                next.images = [];
            }
            delete next.imageField;
            return next;
        }));
        product.variants = [...(product.variants || []), ...normalized];
        product.stock = this.calculateTotalStock(product);
        return product.save();
    }
    transformProduct(product, language) {
        return {
            id: product._id,
            name: product.name?.[language],
            description: product.description?.[language] || '',
            category: product.category || undefined,
            link: product.link,
            variants: product.variants || [],
            smallDescription: product.smallDescription?.[language],
            slug: product.slug,
            sku: product.sku,
            price: {
                amount: product.price?.amount?.[language] || 0,
                currency: product.price?.currency?.[language],
            },
            solde: product.solde || false,
            promotion: product.promotion
                ? {
                    reduced_price: {
                        amount: product.promotion.reduced_price?.[language]?.amount || 0,
                        currency: product.promotion.reduced_price?.[language]?.currency || '',
                    },
                    pourcentage: product.promotion.pourcentage || 0,
                }
                : undefined,
            isLoading: product.isLoading || false,
            label: product.label?.[language] || '',
            isActive: product.isActive || false,
            isFeatured: product.isFeatured || false,
            seoMeta: {
                title: {
                    fr: product.seoMeta?.title?.fr || '',
                    en: product.seoMeta?.title?.en || '',
                },
                description: {
                    fr: product.seoMeta?.description?.fr || '',
                    en: product.seoMeta?.description?.en || '',
                },
                keywords: product.seoMeta?.keywords || [],
            },
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        storage_1.StorageService,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map