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
exports.CartResponseDto = exports.CartItemDto = exports.PromotionDto = exports.PriceDto = exports.ColorDto = exports.TranslatableStringDto = exports.RemoveFromCartDto = exports.UpdateCartItemDto = exports.AddToCartDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AddToCartDto {
    productId;
    quantity;
    selectedVariants;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, selectedVariants: { required: false, type: () => Object } };
    }
}
exports.AddToCartDto = AddToCartDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AddToCartDto.prototype, "selectedVariants", void 0);
class UpdateCartItemDto {
    quantity;
    selectedVariants;
    static _OPENAPI_METADATA_FACTORY() {
        return { quantity: { required: false, type: () => Number, minimum: 1 }, selectedVariants: { required: false, type: () => Object } };
    }
}
exports.UpdateCartItemDto = UpdateCartItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateCartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateCartItemDto.prototype, "selectedVariants", void 0);
class RemoveFromCartDto {
    productId;
    selectedVariants;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, selectedVariants: { required: false, type: () => Object } };
    }
}
exports.RemoveFromCartDto = RemoveFromCartDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveFromCartDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RemoveFromCartDto.prototype, "selectedVariants", void 0);
class TranslatableStringDto {
    fr;
    en;
    static _OPENAPI_METADATA_FACTORY() {
        return { fr: { required: true, type: () => String }, en: { required: true, type: () => String } };
    }
}
exports.TranslatableStringDto = TranslatableStringDto;
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
exports.ColorDto = ColorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ColorDto.prototype, "code", void 0);
class PriceDto {
    amount;
    currency;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 0 }, currency: { required: true, type: () => String } };
    }
}
exports.PriceDto = PriceDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceDto.prototype, "currency", void 0);
class PromotionDto {
    reduced_price;
    pourcentage;
    static _OPENAPI_METADATA_FACTORY() {
        return { reduced_price: { required: true, type: () => Number, minimum: 0 }, pourcentage: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.PromotionDto = PromotionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PromotionDto.prototype, "reduced_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PromotionDto.prototype, "pourcentage", void 0);
class CartItemDto {
    productId;
    sku;
    name;
    description;
    color;
    size;
    image;
    quantity;
    unitPrice;
    promotion;
    totalPrice;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, sku: { required: true, type: () => String }, name: { required: true, type: () => require("./cart.dto").TranslatableStringDto }, description: { required: false, type: () => require("./cart.dto").TranslatableStringDto }, color: { required: false, type: () => require("./cart.dto").ColorDto }, size: { required: false, type: () => String }, image: { required: false, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, unitPrice: { required: true, type: () => require("./cart.dto").PriceDto }, promotion: { required: false, type: () => require("./cart.dto").PromotionDto }, totalPrice: { required: true, type: () => require("./cart.dto").PriceDto }, isActive: { required: true, type: () => Boolean } };
    }
}
exports.CartItemDto = CartItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartItemDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], CartItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TranslatableStringDto)
], CartItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ColorDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ColorDto)
], CartItemDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CartItemDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CartItemDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CartItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CartItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PromotionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PromotionDto)
], CartItemDto.prototype, "promotion", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CartItemDto.prototype, "totalPrice", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CartItemDto.prototype, "isActive", void 0);
class CartResponseDto {
    userId;
    items;
    totalItems;
    subtotal;
    codepromo;
    total;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, items: { required: true, type: () => [require("./cart.dto").CartItemDto] }, totalItems: { required: true, type: () => Number }, subtotal: { required: true, type: () => require("./cart.dto").PriceDto }, codepromo: { required: false, type: () => require("./cart.dto").PriceDto }, total: { required: true, type: () => require("./cart.dto").PriceDto }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.CartResponseDto = CartResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartResponseDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartItemDto),
    __metadata("design:type", Array)
], CartResponseDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CartResponseDto.prototype, "totalItems", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CartResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CartResponseDto.prototype, "codepromo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CartResponseDto.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CartResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=cart.dto.js.map