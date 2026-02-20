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
exports.CreateCategoryDto = exports.CategorySeoMetaDto = exports.I18nFieldDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class I18nFieldDto {
    fr;
    en;
    static _OPENAPI_METADATA_FACTORY() {
        return { fr: { required: true, type: () => String }, en: { required: true, type: () => String } };
    }
}
exports.I18nFieldDto = I18nFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], I18nFieldDto.prototype, "fr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], I18nFieldDto.prototype, "en", void 0);
class CategorySeoMetaDto {
    title;
    description;
    keywords;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-category.dto").I18nFieldDto }, description: { required: false, type: () => require("./create-category.dto").I18nFieldDto }, keywords: { required: false, type: () => [String] } };
    }
}
exports.CategorySeoMetaDto = CategorySeoMetaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nFieldDto),
    __metadata("design:type", I18nFieldDto)
], CategorySeoMetaDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nFieldDto),
    __metadata("design:type", I18nFieldDto)
], CategorySeoMetaDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CategorySeoMetaDto.prototype, "keywords", void 0);
class CreateCategoryDto {
    name;
    slug;
    description;
    parent;
    countries;
    isActive;
    isVisible;
    first;
    second;
    children;
    displayOrder;
    icon;
    image;
    seoMeta;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => require("./create-category.dto").I18nFieldDto }, slug: { required: true, type: () => String, pattern: "/^[a-z0-9]+(?:-[a-z0-9]+)*$/" }, description: { required: true, type: () => require("./create-category.dto").I18nFieldDto }, parent: { required: true, type: () => String, nullable: true, description: "ID de la cat\u00E9gorie parente (null = cat\u00E9gorie racine)" }, countries: { required: false, type: () => [String], description: "Codes pays ISO 3166-1 alpha-2 (ex: ['FR', 'SN', 'CI'])\nVide = disponible partout", pattern: "/^[A-Z]{2}$/" }, isActive: { required: false, type: () => Boolean }, isVisible: { required: false, type: () => Boolean }, first: { required: false, type: () => Boolean }, second: { required: false, type: () => Boolean }, children: { required: false, type: () => [String] }, displayOrder: { required: false, type: () => Number, minimum: 0 }, icon: { required: false, type: () => String }, image: { required: false, type: () => Object }, seoMeta: { required: false, type: () => require("./create-category.dto").CategorySeoMetaDto } };
    }
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nFieldDto),
    __metadata("design:type", I18nFieldDto)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase with hyphens (e.g., "electronics-phones")',
    }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nFieldDto),
    __metadata("design:type", I18nFieldDto)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateCategoryDto.prototype, "parent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.Matches)(/^[A-Z]{2}$/, {
        each: true,
        message: 'Country codes must be ISO 3166-1 alpha-2 (e.g., "FR", "SN")',
    }),
    __metadata("design:type", Array)
], CreateCategoryDto.prototype, "countries", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "isVisible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "first", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "second", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCategoryDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "icon", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCategoryDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategorySeoMetaDto),
    __metadata("design:type", CategorySeoMetaDto)
], CreateCategoryDto.prototype, "seoMeta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCategoryDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-category.dto.js.map