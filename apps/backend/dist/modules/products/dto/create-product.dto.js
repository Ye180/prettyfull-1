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
exports.CreateProductDto = exports.VariantsProductDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TranslatableStringDto {
    fr;
    en;
    static _OPENAPI_METADATA_FACTORY() {
        return { fr: { required: true, type: () => String }, en: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatableStringDto.prototype, "fr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranslatableStringDto.prototype, "en", void 0);
class ColorDto {
    label;
    code;
    static _OPENAPI_METADATA_FACTORY() {
        return { label: { required: true, type: () => String }, code: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorDto.prototype, "code", void 0);
class TranslatablePriceDto {
    fr;
    en;
    static _OPENAPI_METADATA_FACTORY() {
        return { fr: { required: true, type: () => Number, minimum: 0 }, en: { required: true, type: () => Number, minimum: 0 } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TranslatablePriceDto.prototype, "fr", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TranslatablePriceDto.prototype, "en", void 0);
class PriceDto {
    amount;
    currency;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => TranslatablePriceDto }, currency: { required: true, type: () => TranslatableStringDto } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatablePriceDto),
    __metadata("design:type", TranslatablePriceDto)
], PriceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], PriceDto.prototype, "currency", void 0);
class PromotionDto {
    reduced_price;
    pourcentage;
    static _OPENAPI_METADATA_FACTORY() {
        return { reduced_price: { required: true, type: () => TranslatablePriceDto }, pourcentage: { required: true, type: () => Number, minimum: 0, maximum: 100 } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatablePriceDto),
    __metadata("design:type", TranslatablePriceDto)
], PromotionDto.prototype, "reduced_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PromotionDto.prototype, "pourcentage", void 0);
class VariantsProductDto {
    id;
    color;
    size;
    images;
    quantity;
    imageField;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, color: { required: false, type: () => ColorDto }, size: { required: false, type: () => [String] }, images: { required: false, type: () => [String] }, quantity: { required: false, type: () => Number }, imageField: { required: false, type: () => String } };
    }
}
exports.VariantsProductDto = VariantsProductDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantsProductDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ColorDto),
    __metadata("design:type", ColorDto)
], VariantsProductDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VariantsProductDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], VariantsProductDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VariantsProductDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VariantsProductDto.prototype, "imageField", void 0);
class NotVariableProductDto {
    color;
    size;
    image;
    quantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { color: { required: false, type: () => ColorDto }, size: { required: true, type: () => [String] }, image: { required: false, type: () => [String] }, quantity: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ColorDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ColorDto)
], NotVariableProductDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], NotVariableProductDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], NotVariableProductDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], NotVariableProductDto.prototype, "quantity", void 0);
class SeoMetaDto {
    title;
    description;
    keywords;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => TranslatableStringDto }, description: { required: true, type: () => TranslatableStringDto }, keywords: { required: true, type: () => [String], minItems: 1 } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], SeoMetaDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], SeoMetaDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], SeoMetaDto.prototype, "keywords", void 0);
class CreateProductDto {
    name;
    description;
    categoryId;
    link;
    variants;
    notVariable;
    smallDescription;
    slug;
    sku;
    price;
    solde;
    promotion;
    isLoading;
    label;
    isActive;
    isFeatured;
    stock;
    seoMeta;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => TranslatableStringDto }, description: { required: true, type: () => TranslatableStringDto }, categoryId: { required: false, type: () => String }, link: { required: false, type: () => String }, variants: { required: false, type: () => [require("./create-product.dto").VariantsProductDto] }, notVariable: { required: false, type: () => NotVariableProductDto }, smallDescription: { required: false, type: () => TranslatableStringDto }, slug: { required: true, type: () => String, pattern: "/^[a-z0-9]+(?:-[a-z0-9]+)*$/" }, sku: { required: true, type: () => String }, price: { required: true, type: () => PriceDto }, solde: { required: false, type: () => Boolean }, promotion: { required: false, type: () => PromotionDto }, isLoading: { required: false, type: () => Boolean }, label: { required: false, type: () => TranslatableStringDto }, isActive: { required: true, type: () => Boolean }, isFeatured: { required: true, type: () => Boolean }, stock: { required: false, type: () => Number, minimum: 0 }, seoMeta: { required: true, type: () => SeoMetaDto } };
    }
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "link", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VariantsProductDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NotVariableProductDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", NotVariableProductDto)
], CreateProductDto.prototype, "notVariable", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TranslatableStringDto)
], CreateProductDto.prototype, "smallDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "solde", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PromotionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PromotionDto)
], CreateProductDto.prototype, "promotion", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isLoading", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TranslatableStringDto)
], CreateProductDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SeoMetaDto),
    __metadata("design:type", SeoMetaDto)
], CreateProductDto.prototype, "seoMeta", void 0);
//# sourceMappingURL=create-product.dto.js.map