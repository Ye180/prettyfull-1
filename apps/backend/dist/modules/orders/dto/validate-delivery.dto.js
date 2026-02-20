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
exports.ValidateDeliveryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ValidateDeliveryDto {
    validationCode;
    deliveryNote;
    signatureUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { validationCode: { required: true, type: () => String, minLength: 6, maxLength: 6, pattern: "/^[A-Z0-9]{6}$/" }, deliveryNote: { required: false, type: () => String }, signatureUrl: { required: false, type: () => String, format: "uri" } };
    }
}
exports.ValidateDeliveryDto = ValidateDeliveryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Code de validation à 6 caractères alphanumériques',
        example: 'ABC123',
        minLength: 6,
        maxLength: 6,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le code de validation est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, {
        message: 'Le code de validation doit contenir exactement 6 caractères',
    }),
    (0, class_validator_1.Matches)(/^[A-Z0-9]{6}$/, {
        message: 'Le code de validation doit contenir uniquement des lettres majuscules et des chiffres',
    }),
    __metadata("design:type", String)
], ValidateDeliveryDto.prototype, "validationCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Note de livraison du livreur',
        example: 'Colis remis en main propre',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateDeliveryDto.prototype, "deliveryNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la photo de signature/preuve de livraison',
        example: 'https://storage.example.com/signatures/abc123.jpg',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: "L'URL de signature doit être une URL valide" }),
    __metadata("design:type", String)
], ValidateDeliveryDto.prototype, "signatureUrl", void 0);
//# sourceMappingURL=validate-delivery.dto.js.map