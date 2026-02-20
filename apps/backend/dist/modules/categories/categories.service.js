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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const format_response_1 = require("../../shared/utils/format-response");
const product_schema_1 = require("../products/schemas/product.schema");
const storage_service_1 = require("../storage/storage.service");
const category_schema_1 = require("./schemas/category.schema");
let CategoriesService = class CategoriesService {
    categoryModel;
    productModel;
    storageService;
    constructor(categoryModel, productModel, storageService) {
        this.categoryModel = categoryModel;
        this.productModel = productModel;
        this.storageService = storageService;
    }
    async findAll(language = 'fr', includeHidden = false, first, second) {
        const query = {};
        if (!includeHidden) {
            query.isVisible = true;
        }
        if (first !== undefined) {
            query.first = first;
        }
        if (second !== undefined) {
            query.second = second;
        }
        const categories = await this.categoryModel.find(query).lean().exec();
        return categories.map((category) => this.transformCategory(category, language));
    }
    async findOne(id, language = 'fr') {
        const category = await this.categoryModel.findById(id).lean().exec();
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return this.transformCategory(category, language);
    }
    async findChildren(id, language = 'fr') {
        const category = await this.categoryModel.findById(id).lean().exec();
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return (this.transformCategory(category, language).children || []);
    }
    async findPrimaryCategory(language = 'fr') {
        const categories = await this.categoryModel
            .find({ first: true })
            .lean()
            .exec();
        if (!categories || categories.length === 0) {
            throw new common_1.NotFoundException('Aucune catégorie principale trouvée');
        }
        return categories.map((category) => this.transformCategory(category, language));
    }
    async findSecondaryCategory(language = 'fr') {
        const categories = await this.categoryModel
            .find({ second: true })
            .lean()
            .exec();
        if (!categories || categories.length === 0) {
            throw new common_1.NotFoundException('Aucune catégorie principale trouvée');
        }
        return categories.map((category) => this.transformCategory(category, language));
    }
    async findAllWithParent(language = 'fr') {
        const categories = await this.categoryModel
            .find({ parent: { $ne: null } })
            .lean()
            .exec();
        return categories.map((category) => this.transformCategory(category, language));
    }
    async findByName(name, language = 'fr') {
        const category = await this.categoryModel
            .findOne({ name: name })
            .lean()
            .exec();
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return this.transformCategory(category, language);
    }
    async findBySlug(slug, language = 'fr') {
        const category = await this.categoryModel.findOne({ slug }).lean().exec();
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        return this.transformCategory(category, language);
    }
    async create(createCategoryDto, language, image) {
        const existing = await this.categoryModel.findOne({
            slug: createCategoryDto.slug,
        });
        if (existing) {
            throw new common_1.BadRequestException(`Une catégorie avec le slug "${createCategoryDto.slug}" existe déjà`);
        }
        const existingName = await this.categoryModel.findOne({
            name: createCategoryDto.name,
        });
        if (existingName) {
            throw new common_1.BadRequestException(`Une catégorie avec le nom "${createCategoryDto.name[language]}" existe déjà`);
        }
        const { level, path } = await this.calculateLevelAndPath(createCategoryDto.parent, createCategoryDto.slug);
        const newCategoryData = {
            ...createCategoryDto,
            level,
            path,
        };
        if (image) {
            const uploadedImage = await this.storageService.uploadFile(image, 'categories');
            newCategoryData.image = uploadedImage.url;
        }
        const category = new this.categoryModel(newCategoryData);
        return await category.save();
    }
    async update(id, updateCategoryDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        if (updateCategoryDto.slug &&
            updateCategoryDto.slug !== category.slug) {
            const existing = await this.categoryModel.findOne({
                slug: updateCategoryDto.slug,
                _id: { $ne: id },
            });
            if (existing) {
                throw new common_1.BadRequestException(`Une catégorie avec le slug "${updateCategoryDto.slug}" existe déjà`);
            }
        }
        if (updateCategoryDto.parent !== undefined &&
            updateCategoryDto.parent !== category.parent) {
            const { level, path } = await this.calculateLevelAndPath(updateCategoryDto.parent, updateCategoryDto.slug || category.slug);
            Object.assign(category, updateCategoryDto, { level, path });
        }
        else {
            Object.assign(category, updateCategoryDto);
        }
        return await category.save();
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const childrenCount = await this.categoryModel.countDocuments({
            parent: new mongoose_2.Types.ObjectId(id),
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer une catégorie ayant des sous-catégories');
        }
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        category.isActive = false;
        category.isVisible = false;
        await category.save();
        return (0, format_response_1.formatResponse)({
            message: 'La catégorie a été supprimée avec succès',
        });
    }
    async hardDelete(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const childrenCount = await this.categoryModel.countDocuments({
            parent: new mongoose_2.Types.ObjectId(id),
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer une catégorie ayant des sous-catégories');
        }
        const result = await this.categoryModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
    }
    async findAllCategories(country) {
        const query = {};
        if (country) {
            query.$or = [{ countries: country }, { countries: { $size: 0 } }];
        }
        return await this.categoryModel
            .find(query)
            .sort({ level: 1, displayOrder: 1 })
            .exec();
    }
    async getProductOfCategory(categoryId) {
        if (!mongoose_2.Types.ObjectId.isValid(categoryId)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const category = await this.categoryModel.findById(categoryId);
        if (!category) {
            throw new common_1.NotFoundException('Catégorie non trouvée');
        }
        const product = await this.productModel
            .find({ category: categoryId })
            .exec();
        return (0, format_response_1.formatResponse)({
            data: product,
            message: 'Produits de la catégorie récupérés avec succès',
        });
    }
    async findChildrenCategories(parent, language = 'fr') {
        if (!mongoose_2.Types.ObjectId.isValid(parent)) {
            throw new common_1.BadRequestException('ID de catégorie invalide');
        }
        const categories = await this.categoryModel
            .find({ parent: parent })
            .lean()
            .exec();
        const transformedCategories = categories.map((category) => this.transformCategory(category, language));
        return transformedCategories;
    }
    async findChildrenBySlug(slug, language = 'fr') {
        const parentCategory = await this.categoryModel
            .findOne({ slug: slug })
            .lean()
            .exec();
        if (!parentCategory) {
            throw new common_1.NotFoundException('Catégorie parente non trouvée');
        }
        return this.findChildrenCategories(parentCategory._id.toHexString(), language);
    }
    async updateProductCount(categoryId, increment) {
        await this.categoryModel.findByIdAndUpdate(categoryId, {
            $inc: { productCount: increment },
            $set: { updatedAt: new Date() },
        });
    }
    transformCategory(category, language) {
        return {
            id: category._id,
            name: category.name[language] || category.name.fr,
            slug: category.slug,
            description: category.description[language] || category.description.fr,
            parentId: category.parent || null,
            isActive: category.isActive,
            isVisible: category.isVisible,
            children: category.children || [],
            icon: category.icon,
            image: category.image,
            sortOrder: category.sortOrder,
            productCount: category.productCount || 0,
            seoMeta: category.seoMeta
                ? {
                    title: category.seoMeta.title?.[language],
                    description: category.seoMeta.description?.[language],
                    keywords: category.seoMeta.keywords,
                }
                : undefined,
            metadata: category.metadata,
        };
    }
    buildTree(categories, parentId, language, currentDepth, maxDepth) {
        if (currentDepth >= maxDepth) {
            return [];
        }
        const children = categories.filter((cat) => {
            const catParent = cat.parent || null;
            const targetParent = parentId?.toString() || null;
            return catParent === targetParent;
        });
        return children.map((cat) => {
            const transformed = this.transformCategory(cat, language);
            transformed.children = this.buildTree(categories, cat._id, language, currentDepth + 1, maxDepth);
            return transformed;
        });
    }
    async calculateLevelAndPath(parentId, slug) {
        if (!parentId) {
            return { level: 0, path: [slug] };
        }
        if (!mongoose_2.Types.ObjectId.isValid(parentId)) {
            throw new common_1.BadRequestException('ID de catégorie parente invalide');
        }
        const parent = await this.categoryModel.findById(parentId).lean().exec();
        if (!parent) {
            throw new common_1.NotFoundException('Catégorie parente non trouvée');
        }
        const parentData = parent;
        return {
            level: (parentData.level || 0) + 1,
            path: [...(parentData.path || []), slug],
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        storage_service_1.StorageService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map