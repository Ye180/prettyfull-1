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
exports.ProductSchemaDefinition = exports.Product = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let I18nString = class I18nString {
    fr;
    en;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], I18nString.prototype, "fr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], I18nString.prototype, "en", void 0);
I18nString = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], I18nString);
const I18nStringSchema = mongoose_1.SchemaFactory.createForClass(I18nString);
let Color = class Color {
    label;
    code;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Color.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Color.prototype, "code", void 0);
Color = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Color);
const ColorSchema = mongoose_1.SchemaFactory.createForClass(Color);
class I18nPriceString {
    fr;
    en;
}
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], I18nPriceString.prototype, "fr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], I18nPriceString.prototype, "en", void 0);
let Price = class Price {
    amount;
    currency;
};
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fr: { type: Number, required: true },
            en: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", I18nPriceString)
], Price.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fr: { type: String, required: true },
            en: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", I18nString)
], Price.prototype, "currency", void 0);
Price = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Price);
let VariantProduct = class VariantProduct {
    id;
    color;
    size;
    images;
    quantity;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VariantProduct.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ColorSchema, required: true }),
    __metadata("design:type", Color)
], VariantProduct.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], VariantProduct.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], VariantProduct.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], VariantProduct.prototype, "quantity", void 0);
VariantProduct = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], VariantProduct);
const VariantProductSchema = mongoose_1.SchemaFactory.createForClass(VariantProduct);
let NotVariantProduct = class NotVariantProduct {
    color;
    size;
    image;
    quantity;
};
__decorate([
    (0, mongoose_1.Prop)({ type: ColorSchema }),
    __metadata("design:type", Color)
], NotVariantProduct.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], NotVariantProduct.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], NotVariantProduct.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], NotVariantProduct.prototype, "quantity", void 0);
NotVariantProduct = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NotVariantProduct);
let Promotion = class Promotion {
    reduced_price;
    pourcentage;
};
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fr: {
                amount: { type: Number, required: true },
                currency: { type: String, required: true },
            },
            en: {
                amount: { type: Number, required: true },
                currency: { type: String, required: true },
            },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Promotion.prototype, "reduced_price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "pourcentage", void 0);
Promotion = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Promotion);
const PromotionSchema = mongoose_1.SchemaFactory.createForClass(Promotion);
const NotVariantProductSchema = mongoose_1.SchemaFactory.createForClass(NotVariantProduct);
let SeoMeta = class SeoMeta {
    title;
    description;
    keywords;
};
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema, required: true }),
    __metadata("design:type", I18nString)
], SeoMeta.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema, required: true }),
    __metadata("design:type", I18nString)
], SeoMeta.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], SeoMeta.prototype, "keywords", void 0);
SeoMeta = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SeoMeta);
const SeoMetaSchema = mongoose_1.SchemaFactory.createForClass(SeoMeta);
let Product = class Product extends mongoose_2.Document {
    name;
    description;
    category;
    stock;
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
    seoMeta;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema, required: true }),
    __metadata("design:type", I18nString)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema, required: true }),
    __metadata("design:type", I18nString)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Product.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [VariantProductSchema] }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NotVariantProductSchema }),
    __metadata("design:type", NotVariantProduct)
], Product.prototype, "notVariable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], Product.prototype, "smallDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Price, required: true }),
    __metadata("design:type", Price)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "solde", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PromotionSchema }),
    __metadata("design:type", Promotion)
], Product.prototype, "promotion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isLoading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], Product.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SeoMetaSchema, required: true }),
    __metadata("design:type", SeoMeta)
], Product.prototype, "seoMeta", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchemaDefinition = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchemaDefinition.index({ name: 'text', description: 'text' });
exports.ProductSchemaDefinition.index({ sku: 1, isActive: 1 });
exports.ProductSchemaDefinition.index({ category: 1, isActive: 1 });
exports.ProductSchemaDefinition.pre('save', function (next) {
    if (this.variants && this.variants.length > 0) {
        this.stock = this.variants.reduce((total, variant) => {
            return total + (variant.quantity || 0);
        }, 0);
    }
    else if (this.notVariable) {
        this.stock = this.notVariable.quantity || 0;
    }
    next();
});
exports.ProductSchemaDefinition.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.variants && update.variants.length > 0) {
        update.stock = update.variants.reduce((total, variant) => {
            return total + (variant.quantity || 0);
        }, 0);
    }
    else if (update.notVariable) {
        update.stock = update.notVariable.quantity || 0;
    }
    next();
});
//# sourceMappingURL=product.schema.js.map