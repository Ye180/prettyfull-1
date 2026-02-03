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
exports.UpdateSiteContentDto = exports.CreateSiteContentDto = exports.TenSectionDto = exports.NineSectionDto = exports.EightSectionDto = exports.SevenSectionDto = exports.SixSectionDto = exports.FiveSectionDto = exports.FourthSectionDto = exports.ProductDto = exports.ThirdSectionDto = exports.SecondSectionDto = exports.FirstSectionDto = exports.BaseSectionDto = exports.I18nStringDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class I18nStringDto {
    fr;
    en;
    static _OPENAPI_METADATA_FACTORY() {
        return { fr: { required: false, type: () => String }, en: { required: false, type: () => String } };
    }
}
exports.I18nStringDto = I18nStringDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], I18nStringDto.prototype, "fr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], I18nStringDto.prototype, "en", void 0);
class BaseSectionDto {
    title;
    description;
    imageUrlDesktop;
    imageUrlMobile;
    video;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, description: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, imageUrlDesktop: { required: false, type: () => String }, imageUrlMobile: { required: false, type: () => String }, video: { required: false, type: () => String }, category: { required: false, type: () => String } };
    }
}
exports.BaseSectionDto = BaseSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], BaseSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], BaseSectionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSectionDto.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSectionDto.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSectionDto.prototype, "video", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseSectionDto.prototype, "category", void 0);
class FirstSectionDto extends BaseSectionDto {
    paragraphe;
    ctaText;
    static _OPENAPI_METADATA_FACTORY() {
        return { paragraphe: { required: false, type: () => String }, ctaText: { required: false, type: () => require("./create-site-content.dto").I18nStringDto } };
    }
}
exports.FirstSectionDto = FirstSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FirstSectionDto.prototype, "paragraphe", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], FirstSectionDto.prototype, "ctaText", void 0);
class SecondSectionDto {
    title;
    category;
    ctaText;
    parentCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, category: { required: false, type: () => [String] }, ctaText: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, parentCategory: { required: false, type: () => String } };
    }
}
exports.SecondSectionDto = SecondSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], SecondSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SecondSectionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], SecondSectionDto.prototype, "ctaText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecondSectionDto.prototype, "parentCategory", void 0);
class ThirdSectionDto {
    imageUrlDesktop;
    imageUrlMobile;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageUrlDesktop: { required: false, type: () => String }, imageUrlMobile: { required: false, type: () => String }, category: { required: false, type: () => String } };
    }
}
exports.ThirdSectionDto = ThirdSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ThirdSectionDto.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ThirdSectionDto.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ThirdSectionDto.prototype, "category", void 0);
class ProductDto {
    id;
    name;
    price;
    imageUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, name: { required: false, type: () => String }, price: { required: false, type: () => Number }, imageUrl: { required: false, type: () => String } };
    }
}
exports.ProductDto = ProductDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductDto.prototype, "imageUrl", void 0);
class FourthSectionDto {
    title;
    description;
    imageUrl;
    category;
    products;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, description: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, imageUrl: { required: false, type: () => String }, category: { required: false, type: () => String }, products: { required: false, type: () => [String] } };
    }
}
exports.FourthSectionDto = FourthSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], FourthSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], FourthSectionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FourthSectionDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FourthSectionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FourthSectionDto.prototype, "products", void 0);
class FiveSectionDto {
    title;
    category;
    ctaText;
    subCategory;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, category: { required: false, type: () => String }, ctaText: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, subCategory: { required: false, type: () => [String] } };
    }
}
exports.FiveSectionDto = FiveSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], FiveSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveSectionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], FiveSectionDto.prototype, "ctaText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FiveSectionDto.prototype, "subCategory", void 0);
class SixSectionDto {
    imageUrlDesktop;
    imageUrlMobile;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageUrlDesktop: { required: false, type: () => String }, imageUrlMobile: { required: false, type: () => String }, category: { required: false, type: () => String } };
    }
}
exports.SixSectionDto = SixSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SixSectionDto.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SixSectionDto.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SixSectionDto.prototype, "category", void 0);
class SevenSectionDto {
    title;
    ctaText;
    subCategory;
    products;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, ctaText: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, subCategory: { required: false, type: () => String }, products: { required: false, type: () => [String] } };
    }
}
exports.SevenSectionDto = SevenSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], SevenSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], SevenSectionDto.prototype, "ctaText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SevenSectionDto.prototype, "subCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SevenSectionDto.prototype, "products", void 0);
class EightSectionDto {
    imageUrlDesktop;
    imageUrlMobile;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageUrlDesktop: { required: false, type: () => String }, imageUrlMobile: { required: false, type: () => String }, category: { required: false, type: () => String } };
    }
}
exports.EightSectionDto = EightSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EightSectionDto.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EightSectionDto.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EightSectionDto.prototype, "category", void 0);
class NineSectionDto {
    title;
    ctaText;
    subCategory;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, ctaText: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, subCategory: { required: false, type: () => [String] }, category: { required: false, type: () => String } };
    }
}
exports.NineSectionDto = NineSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], NineSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], NineSectionDto.prototype, "ctaText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], NineSectionDto.prototype, "subCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NineSectionDto.prototype, "category", void 0);
class TenSectionDto {
    imageUrlDesktop;
    imageUrlMobile;
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { imageUrlDesktop: { required: false, type: () => String }, imageUrlMobile: { required: false, type: () => String }, category: { required: false, type: () => String } };
    }
}
exports.TenSectionDto = TenSectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenSectionDto.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenSectionDto.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenSectionDto.prototype, "category", void 0);
class CreateSiteContentDto {
    key;
    isActive;
    sortOrder;
    quote;
    firstSection;
    secondSection;
    thirdSection;
    fourthSection;
    fiveSection;
    sixSection;
    sevenSection;
    eightSection;
    nineSection;
    tenSection;
    publishedAt;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, isActive: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number }, quote: { required: false, type: () => require("./create-site-content.dto").I18nStringDto }, firstSection: { required: false, type: () => require("./create-site-content.dto").FirstSectionDto }, secondSection: { required: false, type: () => require("./create-site-content.dto").SecondSectionDto }, thirdSection: { required: false, type: () => require("./create-site-content.dto").ThirdSectionDto }, fourthSection: { required: false, type: () => require("./create-site-content.dto").FourthSectionDto }, fiveSection: { required: false, type: () => require("./create-site-content.dto").FiveSectionDto }, sixSection: { required: false, type: () => require("./create-site-content.dto").SixSectionDto }, sevenSection: { required: false, type: () => require("./create-site-content.dto").SevenSectionDto }, eightSection: { required: false, type: () => require("./create-site-content.dto").EightSectionDto }, nineSection: { required: false, type: () => require("./create-site-content.dto").NineSectionDto }, tenSection: { required: false, type: () => require("./create-site-content.dto").TenSectionDto }, publishedAt: { required: false, type: () => Date }, expiresAt: { required: false, type: () => Date } };
    }
}
exports.CreateSiteContentDto = CreateSiteContentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSiteContentDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSiteContentDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSiteContentDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => I18nStringDto),
    __metadata("design:type", I18nStringDto)
], CreateSiteContentDto.prototype, "quote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FirstSectionDto),
    __metadata("design:type", FirstSectionDto)
], CreateSiteContentDto.prototype, "firstSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SecondSectionDto),
    __metadata("design:type", SecondSectionDto)
], CreateSiteContentDto.prototype, "secondSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ThirdSectionDto),
    __metadata("design:type", ThirdSectionDto)
], CreateSiteContentDto.prototype, "thirdSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FourthSectionDto),
    __metadata("design:type", FourthSectionDto)
], CreateSiteContentDto.prototype, "fourthSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FiveSectionDto),
    __metadata("design:type", FiveSectionDto)
], CreateSiteContentDto.prototype, "fiveSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SixSectionDto),
    __metadata("design:type", SixSectionDto)
], CreateSiteContentDto.prototype, "sixSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SevenSectionDto),
    __metadata("design:type", SevenSectionDto)
], CreateSiteContentDto.prototype, "sevenSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EightSectionDto),
    __metadata("design:type", EightSectionDto)
], CreateSiteContentDto.prototype, "eightSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NineSectionDto),
    __metadata("design:type", NineSectionDto)
], CreateSiteContentDto.prototype, "nineSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TenSectionDto),
    __metadata("design:type", TenSectionDto)
], CreateSiteContentDto.prototype, "tenSection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSiteContentDto.prototype, "publishedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSiteContentDto.prototype, "expiresAt", void 0);
class UpdateSiteContentDto extends CreateSiteContentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSiteContentDto = UpdateSiteContentDto;
//# sourceMappingURL=create-site-content.dto.js.map