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
exports.SiteContentSchema = exports.SiteContent = exports.TenSection = exports.NineSection = exports.EightSection = exports.SevenSection = exports.SixSection = exports.FiveSection = exports.FourthSection = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let I18nString = class I18nString {
    fr;
    en;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true }),
    __metadata("design:type", String)
], I18nString.prototype, "fr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true }),
    __metadata("design:type", String)
], I18nString.prototype, "en", void 0);
I18nString = __decorate([
    (0, mongoose_1.Schema)({ _id: false, versionKey: false })
], I18nString);
const I18nStringSchema = mongoose_1.SchemaFactory.createForClass(I18nString);
let FirstSection = class FirstSection {
    title;
    description;
    imageUrlDesktop;
    imageUrlMobile;
    video;
    ctaText;
    category;
};
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], FirstSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], FirstSection.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FirstSection.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FirstSection.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FirstSection.prototype, "video", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], FirstSection.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], FirstSection.prototype, "category", void 0);
FirstSection = __decorate([
    (0, mongoose_1.Schema)({ _id: false, versionKey: false })
], FirstSection);
const FirstSectionSchema = mongoose_1.SchemaFactory.createForClass(FirstSection);
let SecondSection = class SecondSection {
    title;
    category;
    ctaText;
    parentCategory;
};
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], SecondSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Category' }]),
    __metadata("design:type", Array)
], SecondSection.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], SecondSection.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], SecondSection.prototype, "parentCategory", void 0);
SecondSection = __decorate([
    (0, mongoose_1.Schema)({ _id: false, versionKey: false })
], SecondSection);
const SecondSectionSchema = mongoose_1.SchemaFactory.createForClass(SecondSection);
let ThirdSection = class ThirdSection {
    imageUrlDesktop;
    imageUrlMobile;
    category;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ThirdSection.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ThirdSection.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], ThirdSection.prototype, "category", void 0);
ThirdSection = __decorate([
    (0, mongoose_1.Schema)({ _id: false, versionKey: false })
], ThirdSection);
const ThirdSectionSchema = mongoose_1.SchemaFactory.createForClass(ThirdSection);
let FourthSection = class FourthSection {
    title;
    description;
    imageUrl;
    category;
    products;
};
exports.FourthSection = FourthSection;
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], FourthSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], FourthSection.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FourthSection.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FourthSection.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], FourthSection.prototype, "products", void 0);
exports.FourthSection = FourthSection = __decorate([
    (0, mongoose_1.Schema)()
], FourthSection);
const FourthSectionSchema = mongoose_1.SchemaFactory.createForClass(FourthSection);
let FiveSection = class FiveSection {
    title;
    category;
    ctaText;
    subCategory;
};
exports.FiveSection = FiveSection;
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], FiveSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], FiveSection.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], FiveSection.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], FiveSection.prototype, "subCategory", void 0);
exports.FiveSection = FiveSection = __decorate([
    (0, mongoose_1.Schema)()
], FiveSection);
const FiveSectionSchema = mongoose_1.SchemaFactory.createForClass(FiveSection);
let SixSection = class SixSection {
    imageUrlDesktop;
    imageUrlMobile;
    category;
};
exports.SixSection = SixSection;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SixSection.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SixSection.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SixSection.prototype, "category", void 0);
exports.SixSection = SixSection = __decorate([
    (0, mongoose_1.Schema)()
], SixSection);
const SixSectionSchema = mongoose_1.SchemaFactory.createForClass(SixSection);
let SevenSection = class SevenSection {
    title;
    ctaText;
    subCategory;
    products;
};
exports.SevenSection = SevenSection;
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], SevenSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], SevenSection.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SevenSection.prototype, "subCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], SevenSection.prototype, "products", void 0);
exports.SevenSection = SevenSection = __decorate([
    (0, mongoose_1.Schema)()
], SevenSection);
const SevenSectionSchema = mongoose_1.SchemaFactory.createForClass(SevenSection);
let EightSection = class EightSection {
    imageUrlDesktop;
    imageUrlMobile;
    category;
};
exports.EightSection = EightSection;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EightSection.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EightSection.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], EightSection.prototype, "category", void 0);
exports.EightSection = EightSection = __decorate([
    (0, mongoose_1.Schema)()
], EightSection);
const EightSectionSchema = mongoose_1.SchemaFactory.createForClass(EightSection);
let NineSection = class NineSection {
    title;
    ctaText;
    subCategory;
    category;
};
exports.NineSection = NineSection;
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], NineSection.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", I18nString)
], NineSection.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], NineSection.prototype, "subCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], NineSection.prototype, "category", void 0);
exports.NineSection = NineSection = __decorate([
    (0, mongoose_1.Schema)()
], NineSection);
const NineSectionSchema = mongoose_1.SchemaFactory.createForClass(NineSection);
let TenSection = class TenSection {
    imageUrlDesktop;
    imageUrlMobile;
    category;
};
exports.TenSection = TenSection;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TenSection.prototype, "imageUrlDesktop", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TenSection.prototype, "imageUrlMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TenSection.prototype, "category", void 0);
exports.TenSection = TenSection = __decorate([
    (0, mongoose_1.Schema)()
], TenSection);
const TenSectionSchema = mongoose_1.SchemaFactory.createForClass(TenSection);
let SiteContent = class SiteContent extends mongoose_2.Document {
    key;
    type;
    isActive;
    sortOrder;
    quote;
    first;
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
};
exports.SiteContent = SiteContent;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true, index: true }),
    __metadata("design:type", String)
], SiteContent.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['PAGE', 'SECTION'], required: true }),
    __metadata("design:type", String)
], SiteContent.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SiteContent.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SiteContent.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: I18nStringSchema }),
    __metadata("design:type", I18nString)
], SiteContent.prototype, "quote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FirstSectionSchema }),
    __metadata("design:type", FirstSection)
], SiteContent.prototype, "first", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SecondSectionSchema }),
    __metadata("design:type", SecondSection)
], SiteContent.prototype, "secondSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ThirdSectionSchema }),
    __metadata("design:type", ThirdSection)
], SiteContent.prototype, "thirdSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FourthSectionSchema }),
    __metadata("design:type", FourthSection)
], SiteContent.prototype, "fourthSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FiveSectionSchema }),
    __metadata("design:type", FiveSection)
], SiteContent.prototype, "fiveSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SixSectionSchema }),
    __metadata("design:type", SixSection)
], SiteContent.prototype, "sixSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SevenSectionSchema }),
    __metadata("design:type", SevenSection)
], SiteContent.prototype, "sevenSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: EightSectionSchema }),
    __metadata("design:type", EightSection)
], SiteContent.prototype, "eightSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NineSectionSchema }),
    __metadata("design:type", NineSection)
], SiteContent.prototype, "nineSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TenSectionSchema }),
    __metadata("design:type", TenSection)
], SiteContent.prototype, "tenSection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SiteContent.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SiteContent.prototype, "expiresAt", void 0);
exports.SiteContent = SiteContent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SiteContent);
exports.SiteContentSchema = mongoose_1.SchemaFactory.createForClass(SiteContent);
//# sourceMappingURL=site-content.schema.js.map