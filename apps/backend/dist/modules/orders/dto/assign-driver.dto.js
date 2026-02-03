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
exports.AssignDriverDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignDriverDto {
    driverId;
    estimatedDelivery;
    static _OPENAPI_METADATA_FACTORY() {
        return { driverId: { required: true, type: () => String }, estimatedDelivery: { required: true, type: () => String } };
    }
}
exports.AssignDriverDto = AssignDriverDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID du livreur à assigner',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "L'ID du livreur est requis" }),
    (0, class_validator_1.IsMongoId)({ message: "L'ID du livreur doit être un ObjectId valide" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignDriverDto.prototype, "driverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de livraison estimée',
        example: '2024-12-25T14:30:00.000Z',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La date de livraison estimée est requise' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La date de livraison doit être une date valide' }),
    __metadata("design:type", String)
], AssignDriverDto.prototype, "estimatedDelivery", void 0);
//# sourceMappingURL=assign-driver.dto.js.map