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
exports.SiteContentSchemaDefinition = exports.SiteContentSchema = exports.ContentType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ContentType;
(function (ContentType) {
    ContentType["BANNER"] = "banner";
    ContentType["HERO"] = "hero";
    ContentType["PAGE"] = "page";
    ContentType["BLOCK"] = "block";
})(ContentType || (exports.ContentType = ContentType = {}));
let SiteContentSchema = class SiteContentSchema {
    key;
    type;
    content;
    isActive;
    publishedAt;
    publishedBy;
    metadata;
};
exports.SiteContentSchema = SiteContentSchema;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], SiteContentSchema.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ContentType, required: true, index: true }),
    __metadata("design:type", String)
], SiteContentSchema.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], SiteContentSchema.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], SiteContentSchema.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SiteContentSchema.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SiteContentSchema.prototype, "publishedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SiteContentSchema.prototype, "metadata", void 0);
exports.SiteContentSchema = SiteContentSchema = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SiteContentSchema);
exports.SiteContentSchemaDefinition = mongoose_1.SchemaFactory.createForClass(SiteContentSchema);
exports.SiteContentSchemaDefinition.index({ key: 1, isActive: 1 });
exports.SiteContentSchemaDefinition.index({ type: 1, isActive: 1 });
//# sourceMappingURL=site-content.schema.js.map