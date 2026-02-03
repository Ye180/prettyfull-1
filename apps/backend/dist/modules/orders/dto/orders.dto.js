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
exports.CreateOrderDto = exports.PaymentStatus = exports.OrderStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const address_dto_1 = require("../../address/dto/address.dto");
class PriceDto {
    amount;
    currency;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 0 }, currency: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceDto.prototype, "currency", void 0);
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
class PaymentInfoDto {
    method;
    status;
    transactionId;
    static _OPENAPI_METADATA_FACTORY() {
        return { method: { required: true, type: () => String }, status: { required: true, type: () => String }, transactionId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentInfoDto.prototype, "transactionId", void 0);
class OrderItemDto {
    productId;
    sku;
    name;
    quantity;
    selectedVariants;
    unitPrice;
    totalPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: true, type: () => String }, sku: { required: true, type: () => String }, name: { required: true, type: () => TranslatableStringDto }, quantity: { required: true, type: () => Number, minimum: 1 }, selectedVariants: { required: false, type: () => Object }, unitPrice: { required: true, type: () => PriceDto }, totalPrice: { required: true, type: () => PriceDto } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TranslatableStringDto),
    __metadata("design:type", TranslatableStringDto)
], OrderItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], OrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], OrderItemDto.prototype, "totalPrice", void 0);
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class CreateOrderDto {
    orderNumber;
    userId;
    items;
    billingAddressInfo;
    billingAddress;
    shippingAddress;
    shippingAddressInfo;
    payment;
    subtotal;
    selectedVariants;
    shippingCost;
    discount;
    total;
    currency;
    status;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { orderNumber: { required: true, type: () => String }, userId: { required: false, type: () => String }, items: { required: true, type: () => [OrderItemDto] }, billingAddressInfo: { required: false, type: () => require("../../address/dto/address.dto").AddressDto }, billingAddress: { required: false, type: () => String }, shippingAddress: { required: false, type: () => String }, shippingAddressInfo: { required: false, type: () => require("../../address/dto/address.dto").AddressDto }, payment: { required: true, type: () => PaymentInfoDto }, subtotal: { required: true, type: () => PriceDto }, selectedVariants: { required: true, type: () => [OrderItemDto] }, shippingCost: { required: false, type: () => PriceDto }, discount: { required: false, type: () => PriceDto }, total: { required: true, type: () => PriceDto }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./orders.dto").OrderStatus }, notes: { required: false, type: () => String } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "orderNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    __metadata("design:type", address_dto_1.AddressDto)
], CreateOrderDto.prototype, "billingAddressInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "billingAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    __metadata("design:type", address_dto_1.AddressDto)
], CreateOrderDto.prototype, "shippingAddressInfo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentInfoDto),
    __metadata("design:type", PaymentInfoDto)
], CreateOrderDto.prototype, "payment", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CreateOrderDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "selectedVariants", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PriceDto)
], CreateOrderDto.prototype, "shippingCost", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PriceDto)
], CreateOrderDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CreateOrderDto.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(OrderStatus),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
//# sourceMappingURL=orders.dto.js.map