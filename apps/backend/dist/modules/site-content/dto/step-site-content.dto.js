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
exports.UpdateStep3Dto = exports.UpdateStep2Dto = exports.CreateStep1Dto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const content_constants_1 = require("../constants/content.constants");
const create_site_content_dto_1 = require("./create-site-content.dto");
class CreateStep1Dto {
    key;
    type;
    isActive;
    sortOrder;
    quote;
    first;
    secondSection;
    thirdSection;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, type: { required: true, enum: require("../constants/content.constants").ContentType }, isActive: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number }, quote: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, first: { required: false, type: () => require("./create-site-content.dto").FirstSectionDto }, secondSection: { required: false, type: () => require("./create-site-content.dto").SecondSectionDto }, thirdSection: { required: false, type: () => require("./create-site-content.dto").ThirdSectionDto } };
    }
}
exports.CreateStep1Dto = CreateStep1Dto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStep1Dto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStep1Dto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateStep1Dto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStep1Dto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.I18nStringDto),
    __metadata("design:type", create_site_content_dto_1.I18nStringDto)
], CreateStep1Dto.prototype, "quote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.FirstSectionDto),
    __metadata("design:type", create_site_content_dto_1.FirstSectionDto)
], CreateStep1Dto.prototype, "first", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.SecondSectionDto),
    __metadata("design:type", create_site_content_dto_1.SecondSectionDto)
], CreateStep1Dto.prototype, "secondSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.ThirdSectionDto),
    __metadata("design:type", create_site_content_dto_1.ThirdSectionDto)
], CreateStep1Dto.prototype, "thirdSection", void 0);
class UpdateStep2Dto {
    id;
    fourthSection;
    fiveSection;
    sixSection;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, fourthSection: { required: false, type: () => require("./create-site-content.dto").FourthSectionDto }, fiveSection: { required: false, type: () => require("./create-site-content.dto").FiveSectionDto }, sixSection: { required: false, type: () => require("./create-site-content.dto").SixSectionDto } };
    }
}
exports.UpdateStep2Dto = UpdateStep2Dto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStep2Dto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.FourthSectionDto),
    __metadata("design:type", create_site_content_dto_1.FourthSectionDto)
], UpdateStep2Dto.prototype, "fourthSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.FiveSectionDto),
    __metadata("design:type", create_site_content_dto_1.FiveSectionDto)
], UpdateStep2Dto.prototype, "fiveSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.SixSectionDto),
    __metadata("design:type", create_site_content_dto_1.SixSectionDto)
], UpdateStep2Dto.prototype, "sixSection", void 0);
class UpdateStep3Dto {
    id;
    sevenSection;
    eightSection;
    nineSection;
    tenSection;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, sevenSection: { required: false, type: () => require("./create-site-content.dto").SevenSectionDto }, eightSection: { required: false, type: () => require("./create-site-content.dto").EightSectionDto }, nineSection: { required: false, type: () => require("./create-site-content.dto").NineSectionDto }, tenSection: { required: false, type: () => require("./create-site-content.dto").TenSectionDto } };
    }
}
exports.UpdateStep3Dto = UpdateStep3Dto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStep3Dto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.SevenSectionDto),
    __metadata("design:type", create_site_content_dto_1.SevenSectionDto)
], UpdateStep3Dto.prototype, "sevenSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.EightSectionDto),
    __metadata("design:type", create_site_content_dto_1.EightSectionDto)
], UpdateStep3Dto.prototype, "eightSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.NineSectionDto),
    __metadata("design:type", create_site_content_dto_1.NineSectionDto)
], UpdateStep3Dto.prototype, "nineSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_site_content_dto_1.TenSectionDto),
    __metadata("design:type", create_site_content_dto_1.TenSectionDto)
], UpdateStep3Dto.prototype, "tenSection", void 0);
//# sourceMappingURL=step-site-content.dto.js.map