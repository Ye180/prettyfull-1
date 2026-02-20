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
exports.OrderSchema = exports.Order = exports.OrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const address_dto_1 = require("../../address/dto/address.dto");
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
class I18nString {
    fr;
    en;
}
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], I18nString.prototype, "fr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], I18nString.prototype, "en", void 0);
let PaymentInfo = class PaymentInfo {
    method;
    status;
    transactionId;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], PaymentInfo.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], PaymentInfo.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], PaymentInfo.prototype, "transactionId", void 0);
PaymentInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentInfo);
const PaymentInfoSchema = mongoose_1.SchemaFactory.createForClass(PaymentInfo);
let OrderItem = class OrderItem {
    product;
    sku;
    name;
    quantity;
    unitPrice;
    totalPrice;
    selectedVariants;
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrderItem.prototype, "product", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nString, required: true }),
    __metadata("design:type", I18nString)
], OrderItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], OrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], OrderItem.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], OrderItem.prototype, "selectedVariants", void 0);
OrderItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderItem);
const OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItem);
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
let Order = class Order extends mongoose_2.Document {
    orderNumber;
    userId;
    items;
    billingAddress;
    shippingAddress;
    shippingAddressInfo;
    payment;
    subtotal;
    shippingCost;
    discount;
    total;
    currency;
    status;
    driverId;
    validationCode;
    estimatedDelivery;
    assignedAt;
    deliveryNote;
    signatureUrl;
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [OrderItemSchema], required: true }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Address', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "billingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Address', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: address_dto_1.AddressDto }),
    __metadata("design:type", address_dto_1.AddressDto)
], Order.prototype, "shippingAddressInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentInfoSchema, required: false }),
    __metadata("design:type", PaymentInfo)
], Order.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema }),
    __metadata("design:type", Price)
], Order.prototype, "shippingCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema }),
    __metadata("design:type", Price)
], Order.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PriceSchema, required: true }),
    __metadata("design:type", Price)
], Order.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "driverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, length: 6, uppercase: true }),
    __metadata("design:type", String)
], Order.prototype, "validationCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "assignedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "deliveryNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "signatureUrl", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=orders.schema.js.map