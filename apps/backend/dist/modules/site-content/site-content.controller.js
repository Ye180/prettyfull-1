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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const create_site_content_dto_1 = require("./dto/create-site-content.dto");
const site_content_service_1 = require("./site-content.service");
let SiteContentController = class SiteContentController {
    siteContentService;
    constructor(siteContentService) {
        this.siteContentService = siteContentService;
    }
    create(dto) {
        return this.siteContentService.create(dto);
    }
    createStep1(body, files) {
        const sortOrderValue = body.sortOrder
            ? Number(body.sortOrder)
            : body.sortOrder === 0
                ? 0
                : 0;
        const dto = {
            key: body.key,
            type: body.type || 'SECTION',
            isActive: body.isActive === 'true' || body.isActive === true,
            sortOrder: isNaN(sortOrderValue) ? 0 : sortOrderValue,
            quote: body.quote ? JSON.parse(body.quote) : undefined,
            first: body.first ? JSON.parse(body.first) : undefined,
            secondSection: body.secondSection
                ? JSON.parse(body.secondSection)
                : undefined,
            thirdSection: body.thirdSection
                ? JSON.parse(body.thirdSection)
                : undefined,
        };
        return this.siteContentService.createStep1(dto, files);
    }
    updateStep2(id, body, files) {
        const dto = {
            fourthSection: body.fourthSection
                ? JSON.parse(body.fourthSection)
                : undefined,
            fiveSection: body.fiveSection ? JSON.parse(body.fiveSection) : undefined,
            sixSection: body.sixSection ? JSON.parse(body.sixSection) : undefined,
        };
        return this.siteContentService.updateStep2(id, dto, files);
    }
    updateStep3(id, body, files) {
        const dto = {
            sevenSection: body.sevenSection
                ? JSON.parse(body.sevenSection)
                : undefined,
            eightSection: body.eightSection
                ? JSON.parse(body.eightSection)
                : undefined,
            nineSection: body.nineSection ? JSON.parse(body.nineSection) : undefined,
            tenSection: body.tenSection ? JSON.parse(body.tenSection) : undefined,
        };
        return this.siteContentService.updateStep3(id, dto, files);
    }
    findAllVisible(type) {
        return this.siteContentService.findAllVisible(type);
    }
    findAll(type, isActive) {
        return this.siteContentService.findAll({ type, isActive });
    }
    findOne(id) {
        return this.siteContentService.findOne(id);
    }
    findByKey(key) {
        return this.siteContentService.findByKey(key);
    }
    toggleActive(id, isActive) {
        return this.siteContentService.toggleActive(id, isActive);
    }
    findPrimaryCategories() {
        return this.siteContentService.findKeyVisibleCategories();
    }
    findByCategorySlugName(slugName) {
        return this.siteContentService.findKeyCategoriesSlugname(slugName);
    }
    async findKeyCategoriesSlugname(slugname, language) {
        const lang = language === 'en' ? 'en' : 'fr';
        return this.siteContentService.findKeyCategoriesSlugname(slugname, lang);
    }
};
exports.SiteContentController = SiteContentController;
__decorate([
    (0, common_1.Post)(),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 201, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_content_dto_1.CreateSiteContentDto]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('step-1'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 201, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "createStep1", null);
__decorate([
    openapi.ApiOperation({ summary: "Step 2: Mettre \u00E0 jour avec les sections 4, 5 et 6" }),
    (0, common_1.Patch)(':id/step-2'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "updateStep2", null);
__decorate([
    openapi.ApiOperation({ summary: "Step 3: Finaliser avec les sections 7, 8, 9 et 10" }),
    (0, common_1.Patch)(':id/step-3'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "updateStep3", null);
__decorate([
    (0, common_1.Get)('visible'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [require("./schemas/site-content.schema").SiteContent] }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findAllVisible", null);
__decorate([
    openapi.ApiOperation({ summary: "Route admin: r\u00E9cup\u00E8re tous les contenus avec population des cat\u00E9gories" }),
    (0, common_1.Get)('all'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [require("./schemas/site-content.schema").SiteContent] }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    openapi.ApiResponse({ status: 200, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: require("./schemas/site-content.schema").SiteContent }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Get)('keys/categories'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findPrimaryCategories", null);
__decorate([
    (0, common_1.Get)('keys/category-slug/:slugName'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('slugName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "findByCategorySlugName", null);
__decorate([
    (0, common_1.Get)('key-categories/:slugname'),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('slugname')),
    __param(1, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SiteContentController.prototype, "findKeyCategoriesSlugname", null);
exports.SiteContentController = SiteContentController = __decorate([
    (0, common_1.Controller)('site-content'),
    __metadata("design:paramtypes", [site_content_service_1.SiteContentService])
], SiteContentController);
//# sourceMappingURL=site-content.controller.js.map