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
exports.CartSchema = exports.Cart = void 0;
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
let Price = class Price {
    amount;
    currency;
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], Price.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Price.prototype, "currency", void 0);
Price = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Price);
const PriceSchema = mongoose_1.SchemaFactory.createForClass(Price);
let Promotion = class Promotion {
    reduced_price;
    pourcentage;
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "reduced_price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "pourcentage", void 0);
Promotion = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Promotion);
const PromotionSchema = mongoose_1.SchemaFactory.createForClass(Promotion);
let CartItem = class CartItem {
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
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema, required: true }),
    __metadata("design:type", I18nString)
], CartItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], CartItem.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ColorSchema }),
    __metadata("design:type", Color)
], CartItem.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CartItem.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CartItem.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], CartItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PromotionSchema }),
    __metadata("design:type", Promotion)
], CartItem.prototype, "promotion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], CartItem.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], CartItem.prototype, "isActive", void 0);
CartItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CartItem);
const CartItemSchema = mongoose_1.SchemaFactory.createForClass(CartItem);
let Cart = class Cart extends mongoose_2.Document {
    user;
    items;
    total;
    isActive;
};
exports.Cart = Cart;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Cart.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CartItemSchema], default: [] }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], Cart.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Cart.prototype, "isActive", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
//# sourceMappingURL=carts.schema.js.map