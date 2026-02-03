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
exports.PaymentSchemaDefinition = exports.PaymentSchema = exports.PaymentStatus = exports.PaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CASH_ON_DELIVERY"] = "cash_on_delivery";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let PaymentSchema = class PaymentSchema {
    paymentReference;
    order;
    method;
    status;
    amount;
    paidAt;
    transactionId;
    metadata;
};
exports.PaymentSchema = PaymentSchema;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], PaymentSchema.prototype, "paymentReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'OrderSchema',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PaymentSchema.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: PaymentMethod,
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], PaymentSchema.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], PaymentSchema.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], PaymentSchema.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], PaymentSchema.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentSchema.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], PaymentSchema.prototype, "metadata", void 0);
exports.PaymentSchema = PaymentSchema = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PaymentSchema);
exports.PaymentSchemaDefinition = mongoose_1.SchemaFactory.createForClass(PaymentSchema);
exports.PaymentSchemaDefinition.index({ paymentReference: 1, status: 1 });
exports.PaymentSchemaDefinition.index({ order: 1, status: 1 });
exports.PaymentSchemaDefinition.index({ method: 1, status: 1 });
//# sourceMappingURL=payment.schema.js.map