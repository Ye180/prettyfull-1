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
exports.SupportedCurrency = exports.SupportedLanguage = exports.PriceSchema = exports.PriceClass = exports.I18nStringSchema = exports.I18nStringClass = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let I18nStringClass = class I18nStringClass {
    fr;
    en;
};
exports.I18nStringClass = I18nStringClass;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], I18nStringClass.prototype, "fr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], I18nStringClass.prototype, "en", void 0);
exports.I18nStringClass = I18nStringClass = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], I18nStringClass);
exports.I18nStringSchema = mongoose_1.SchemaFactory.createForClass(I18nStringClass);
let PriceClass = class PriceClass {
    amount;
    currency;
};
exports.PriceClass = PriceClass;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], PriceClass.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'XOF', enum: ['XOF'] }),
    __metadata("design:type", String)
], PriceClass.prototype, "currency", void 0);
exports.PriceClass = PriceClass = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PriceClass);
exports.PriceSchema = mongoose_1.SchemaFactory.createForClass(PriceClass);
var SupportedLanguage;
(function (SupportedLanguage) {
    SupportedLanguage["FR"] = "fr";
    SupportedLanguage["EN"] = "en";
})(SupportedLanguage || (exports.SupportedLanguage = SupportedLanguage = {}));
var SupportedCurrency;
(function (SupportedCurrency) {
    SupportedCurrency["XOF"] = "XOF";
    SupportedCurrency["USD"] = "USD";
})(SupportedCurrency || (exports.SupportedCurrency = SupportedCurrency = {}));
//# sourceMappingURL=i18n.schema.js.map