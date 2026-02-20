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
var SiteContentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../categories/schemas/category.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const storage_service_1 = require("../storage/storage.service");
const site_content_schema_1 = require("./schemas/site-content.schema");
let SiteContentService = SiteContentService_1 = class SiteContentService {
    siteContentModel;
    categoryModel;
    productModel;
    storageService;
    logger = new common_1.Logger(SiteContentService_1.name);
    constructor(siteContentModel, categoryModel, productModel, storageService) {
        this.siteContentModel = siteContentModel;
        this.categoryModel = categoryModel;
        this.productModel = productModel;
        this.storageService = storageService;
    }
    async create(createDto) {
        const created = new this.siteContentModel(createDto);
        return created.save();
    }
    async createStep1(dto, files) {
        const dataToSave = { ...dto };
        if (files && files.length > 0) {
            this.logger.log(`Uploading ${files.length} files for site-content step1`);
            const filesByField = {};
            files.forEach((file) => {
                filesByField[file.fieldname] = file;
            });
            if (filesByField['first.imageUrlDesktop']) {
                const uploaded = await this.storageService.uploadFile(filesByField['first.imageUrlDesktop'], 'site-content');
                if (!dataToSave.first)
                    dataToSave.first = {};
                dataToSave.first.imageUrlDesktop = uploaded.url;
                this.logger.log(`Uploaded first.imageUrlDesktop: ${uploaded.url}`);
            }
            if (filesByField['first.imageUrlMobile']) {
                const uploaded = await this.storageService.uploadFile(filesByField['first.imageUrlMobile'], 'site-content');
                if (!dataToSave.first)
                    dataToSave.first = {};
                dataToSave.first.imageUrlMobile = uploaded.url;
                this.logger.log(`Uploaded first.imageUrlMobile: ${uploaded.url}`);
            }
            if (filesByField['first.video']) {
                const uploaded = await this.storageService.uploadFile(filesByField['first.video'], 'site-content');
                if (!dataToSave.first)
                    dataToSave.first = {};
                dataToSave.first.video = uploaded.url;
                this.logger.log(`Uploaded first.video: ${uploaded.url}`);
            }
            if (filesByField['thirdSection.imageUrlDesktop']) {
                const uploaded = await this.storageService.uploadFile(filesByField['thirdSection.imageUrlDesktop'], 'site-content');
                if (!dataToSave.thirdSection)
                    dataToSave.thirdSection = {};
                dataToSave.thirdSection.imageUrlDesktop = uploaded.url;
                this.logger.log(`Uploaded thirdSection.imageUrlDesktop: ${uploaded.url}`);
            }
            if (filesByField['thirdSection.imageUrlMobile']) {
                const uploaded = await this.storageService.uploadFile(filesByField['thirdSection.imageUrlMobile'], 'site-content');
                if (!dataToSave.thirdSection)
                    dataToSave.thirdSection = {};
                dataToSave.thirdSection.imageUrlMobile = uploaded.url;
                this.logger.log(`Uploaded thirdSection.imageUrlMobile: ${uploaded.url}`);
            }
        }
        const created = new this.siteContentModel(dataToSave);
        return created.save();
    }
    async updateStep2(id, dto, files) {
        const dataToUpdate = { ...dto };
        if (files && files.length > 0) {
            this.logger.log(`Uploading ${files.length} files for site-content step2`);
            const filesByField = {};
            files.forEach((file) => {
                filesByField[file.fieldname] = file;
            });
            if (filesByField['fourthSection.imageUrl']) {
                const uploaded = await this.storageService.uploadFile(filesByField['fourthSection.imageUrl'], 'site-content');
                if (!dataToUpdate.fourthSection)
                    dataToUpdate.fourthSection = {};
                dataToUpdate.fourthSection.imageUrl = uploaded.url;
                this.logger.log(`Uploaded fourthSection.imageUrl: ${uploaded.url}`);
            }
            if (filesByField['sixSection.imageUrlDesktop']) {
                const uploaded = await this.storageService.uploadFile(filesByField['sixSection.imageUrlDesktop'], 'site-content');
                if (!dataToUpdate.sixSection)
                    dataToUpdate.sixSection = {};
                dataToUpdate.sixSection.imageUrlDesktop = uploaded.url;
                this.logger.log(`Uploaded sixSection.imageUrlDesktop: ${uploaded.url}`);
            }
            if (filesByField['sixSection.imageUrlMobile']) {
                const uploaded = await this.storageService.uploadFile(filesByField['sixSection.imageUrlMobile'], 'site-content');
                if (!dataToUpdate.sixSection)
                    dataToUpdate.sixSection = {};
                dataToUpdate.sixSection.imageUrlMobile = uploaded.url;
                this.logger.log(`Uploaded sixSection.imageUrlMobile: ${uploaded.url}`);
            }
        }
        const updated = await this.siteContentModel
            .findByIdAndUpdate(id, {
            $set: {
                fourthSection: dataToUpdate.fourthSection,
                fiveSection: dataToUpdate.fiveSection,
                sixSection: dataToUpdate.sixSection,
            },
        }, { new: true, runValidators: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`SiteContent avec ID "${id}" non trouvé`);
        }
        return updated;
    }
    async updateStep3(id, dto, files) {
        const dataToUpdate = { ...dto };
        if (files && files.length > 0) {
            this.logger.log(`Uploading ${files.length} files for site-content step3`);
            const filesByField = {};
            files.forEach((file) => {
                filesByField[file.fieldname] = file;
            });
            if (filesByField['eightSection.imageUrlDesktop']) {
                const uploaded = await this.storageService.uploadFile(filesByField['eightSection.imageUrlDesktop'], 'site-content');
                if (!dataToUpdate.eightSection)
                    dataToUpdate.eightSection = {};
                dataToUpdate.eightSection.imageUrlDesktop = uploaded.url;
                this.logger.log(`Uploaded eightSection.imageUrlDesktop: ${uploaded.url}`);
            }
            if (filesByField['eightSection.imageUrlMobile']) {
                const uploaded = await this.storageService.uploadFile(filesByField['eightSection.imageUrlMobile'], 'site-content');
                if (!dataToUpdate.eightSection)
                    dataToUpdate.eightSection = {};
                dataToUpdate.eightSection.imageUrlMobile = uploaded.url;
                this.logger.log(`Uploaded eightSection.imageUrlMobile: ${uploaded.url}`);
            }
            if (filesByField['tenSection.imageUrlDesktop']) {
                const uploaded = await this.storageService.uploadFile(filesByField['tenSection.imageUrlDesktop'], 'site-content');
                if (!dataToUpdate.tenSection)
                    dataToUpdate.tenSection = {};
                dataToUpdate.tenSection.imageUrlDesktop = uploaded.url;
                this.logger.log(`Uploaded tenSection.imageUrlDesktop: ${uploaded.url}`);
            }
            if (filesByField['tenSection.imageUrlMobile']) {
                const uploaded = await this.storageService.uploadFile(filesByField['tenSection.imageUrlMobile'], 'site-content');
                if (!dataToUpdate.tenSection)
                    dataToUpdate.tenSection = {};
                dataToUpdate.tenSection.imageUrlMobile = uploaded.url;
                this.logger.log(`Uploaded tenSection.imageUrlMobile: ${uploaded.url}`);
            }
        }
        const updated = await this.siteContentModel
            .findByIdAndUpdate(id, {
            $set: {
                sevenSection: dataToUpdate.sevenSection,
                eightSection: dataToUpdate.eightSection,
                nineSection: dataToUpdate.nineSection,
                tenSection: dataToUpdate.tenSection,
            },
        }, { new: true, runValidators: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`SiteContent avec ID "${id}" non trouvé`);
        }
        return updated;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.type)
            query.type = filters.type;
        if (filters?.isActive !== undefined)
            query.isActive = filters.isActive;
        return this.siteContentModel
            .find(query)
            .sort({ sortOrder: 1 })
            .populate('key', 'name slug imageUrl')
            .populate('first.category', 'name slug imageUrl')
            .populate('secondSection.category', 'name slug imageUrl')
            .populate('secondSection.parentCategory', 'name slug imageUrl')
            .populate('thirdSection.category', 'name slug imageUrl')
            .exec();
    }
    async findAllVisible(type) {
        const query = { isActive: true };
        if (type)
            query.type = type;
        return this.siteContentModel
            .find(query)
            .sort({ sortOrder: 1 })
            .populate('key', 'name slug imageUrl')
            .populate('first.category', 'name slug imageUrl')
            .populate('secondSection.category', 'name slug imageUrl')
            .populate('secondSection.parentCategory', 'name slug imageUrl')
            .populate('thirdSection.category', 'name slug imageUrl')
            .exec();
    }
    async findOne(id) {
        const content = await this.siteContentModel.findById(id).exec();
        if (!content) {
            throw new common_1.NotFoundException(`SiteContent with ID "${id}" not found`);
        }
        return content;
    }
    async findByKey(key) {
        const content = await this.siteContentModel.findOne({ key }).exec();
        if (!content) {
            throw new common_1.NotFoundException(`SiteContent with key "${key}" not found`);
        }
        return content;
    }
    async findKeyVisibleCategories() {
        const keysOfSiteContent = await this.siteContentModel
            .find({
            isActive: true,
        })
            .lean()
            .exec();
        const categoryIds = keysOfSiteContent
            .map((content) => content.key)
            .filter((key) => key);
        const findyCategories = await this.categoryModel
            .find({
            _id: { $in: categoryIds },
            isActive: true,
        })
            .lean()
            .exec();
        const transformedCategories = findyCategories.map((category) => this.transformCategory(category, 'fr'));
        return transformedCategories;
    }
    async findKeyVisibleProducts() {
        const keysOfSiteContent = await this.siteContentModel
            .find({
            isActive: true,
        })
            .lean()
            .exec();
        const productIds = keysOfSiteContent
            .map((content) => content.key)
            .filter((key) => key);
        const findyProducts = await this.productModel
            .find({
            _id: { $in: productIds },
            isActive: true,
        })
            .lean()
            .exec();
        const transformedProducts = findyProducts.map((product) => this.transformProduct(product, 'fr'));
        return transformedProducts;
    }
    async findPrimaryCategoriesFromCategoryModel() {
        return this.categoryModel.find({ isPrimary: true }).lean().exec();
    }
    async findKeyCategoriesSlugname(slugname, language = 'fr') {
        const category = await this.categoryModel
            .findOne({ slug: slugname, isActive: true })
            .lean()
            .exec();
        if (!category) {
            throw new common_1.NotFoundException(`Catégorie avec slug "${slugname}" non trouvée`);
        }
        const content = await this.siteContentModel
            .findOne({ key: category._id })
            .populate('key')
            .populate('first.category')
            .populate('secondSection.category')
            .populate('secondSection.parentCategory')
            .populate('thirdSection.category')
            .populate('nineSection.category')
            .lean()
            .exec();
        if (!content) {
            throw new common_1.NotFoundException(`SiteContent avec key "${category._id}" non trouvé`);
        }
        const transformed = this.transformSiteContent(content, language);
        common_1.Logger.log('Content found for key category slugname:', transformed);
        return transformed;
    }
    async toggleActive(id, isActive) {
        const content = await this.siteContentModel.findById(id).exec();
        if (!content) {
            throw new common_1.NotFoundException(`SiteContent with ID "${id}" not found`);
        }
        content.isActive = isActive;
        return content.save();
    }
    transformSiteContent(content, language) {
        return {
            _id: content._id,
            type: content.type,
            isActive: content.isActive,
            sortOrder: content.sortOrder,
            key: content.key ? this.transformCategory(content.key, language) : null,
            first: content.first
                ? {
                    imageUrlDesktop: content.first.imageUrlDesktop,
                    imageUrlMobile: content.first.imageUrlMobile,
                    video: content.first.video,
                    title: content.first.title?.[language] || content.first.title?.fr || '',
                    description: content.first.description?.[language] ||
                        content.first.description?.fr ||
                        '',
                    button: content.first.ctaText?.[language] ||
                        content.first.ctaText?.fr ||
                        '',
                    category: content.first.category
                        ? this.transformCategory(content.first.category, language)
                        : null,
                }
                : null,
            secondSection: content.secondSection
                ? {
                    title: content.secondSection.title?.[language] ||
                        content.secondSection.title?.fr ||
                        '',
                    description: content.secondSection.description?.[language] ||
                        content.secondSection.description?.fr ||
                        '',
                    button: content.secondSection.ctaText?.[language] ||
                        content.secondSection.ctaText?.fr ||
                        '',
                    category: Array.isArray(content.secondSection.category)
                        ? content.secondSection.category.map((c) => this.transformCategory(c, language))
                        : content.secondSection.category
                            ? this.transformCategory(content.secondSection.category, language)
                            : null,
                    parentCategory: content.secondSection.parentCategory
                        ? this.transformCategory(content.secondSection.parentCategory, language)
                        : null,
                }
                : null,
            thirdSection: content.thirdSection
                ? {
                    imageUrlDesktop: content.thirdSection.imageUrlDesktop,
                    imageUrlMobile: content.thirdSection.imageUrlMobile,
                    title: content.thirdSection.title?.[language] ||
                        content.thirdSection.title?.fr ||
                        '',
                    description: content.thirdSection.description?.[language] ||
                        content.thirdSection.description?.fr ||
                        '',
                    category: content.thirdSection.category
                        ? this.transformCategory(content.thirdSection.category, language)
                        : null,
                }
                : null,
            fourthSection: content.fourthSection
                ? {
                    imageUrl: content.fourthSection.imageUrl,
                    title: content.fourthSection.title?.[language] ||
                        content.fourthSection.title?.fr ||
                        '',
                    description: content.fourthSection.description?.[language] ||
                        content.fourthSection.description?.fr ||
                        '',
                    products: (() => {
                        const list = content.fourthSection?.products;
                        if (!Array.isArray(list))
                            return [];
                        const result = [];
                        for (const prod of list) {
                            result.push(this.transformProduct(prod, language));
                        }
                        return result;
                    })(),
                }
                : null,
            fiveSection: content.fiveSection
                ? {
                    title: content.fiveSection.title?.[language] ||
                        content.fiveSection.title?.fr ||
                        '',
                    button: content.fiveSection.ctaText?.[language] ||
                        content.fiveSection.ctaText?.fr ||
                        '',
                    items: content.fiveSection.subCategory,
                }
                : null,
            sixSection: content.sixSection
                ? {
                    imageUrlDesktop: content.sixSection.imageUrlDesktop,
                    imageUrlMobile: content.sixSection.imageUrlMobile,
                    title: content.sixSection.title?.[language] ||
                        content.sixSection.title?.fr ||
                        '',
                    description: content.sixSection.description?.[language] ||
                        content.sixSection.description?.fr ||
                        '',
                }
                : null,
            sevenSection: content.sevenSection
                ? {
                    title: content.sevenSection.title?.[language] ||
                        content.sevenSection.title?.fr ||
                        '',
                    items: content.sevenSection.items,
                }
                : null,
            eightSection: content.eightSection
                ? {
                    imageUrlDesktop: content.eightSection.imageUrlDesktop,
                    imageUrlMobile: content.eightSection.imageUrlMobile,
                    title: content.eightSection.title?.[language] ||
                        content.eightSection.title?.fr ||
                        '',
                    description: content.eightSection.description?.[language] ||
                        content.eightSection.description?.fr ||
                        '',
                }
                : null,
            nineSection: content.nineSection
                ? {
                    title: content.nineSection.title?.[language] ||
                        content.nineSection.title?.fr ||
                        '',
                    items: content.nineSection.subCategory
                        ? this.transformCategory(content.nineSection.subCategory, language)
                        : null,
                }
                : null,
            tenSection: content.tenSection
                ? {
                    imageUrlDesktop: content.tenSection.imageUrlDesktop,
                    imageUrlMobile: content.tenSection.imageUrlMobile,
                    title: content.tenSection.title?.[language] ||
                        content.tenSection.title?.fr ||
                        '',
                    description: content.tenSection.description?.[language] ||
                        content.tenSection.description?.fr ||
                        '',
                }
                : null,
        };
    }
    transformCategory(category, language) {
        return {
            id: category._id,
            name: category.name?.[language] || category.name?.fr || '',
            slug: category.slug || '',
            description: category.description?.[language] || category.description?.fr || '',
            parentId: category.parent || null,
            isActive: category.isActive ?? true,
            isVisible: category.isVisible ?? true,
            children: category.children || [],
            icon: category.icon,
            image: category.image,
            sortOrder: category.sortOrder || 0,
            productCount: category.productCount || 0,
            seoMeta: category.seoMeta
                ? {
                    title: category.seoMeta.title?.[language] || category.seoMeta.title?.fr,
                    description: category.seoMeta.description?.[language] ||
                        category.seoMeta.description?.fr,
                    keywords: category.seoMeta.keywords,
                }
                : undefined,
            metadata: category.metadata,
        };
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
exports.SiteContentService = SiteContentService;
exports.SiteContentService = SiteContentService = SiteContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(site_content_schema_1.SiteContent.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        storage_service_1.StorageService])
], SiteContentService);
//# sourceMappingURL=site-content.service.js.map