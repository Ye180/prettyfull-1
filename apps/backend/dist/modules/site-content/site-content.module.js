"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const category_schema_1 = require("../categories/schemas/category.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const storage_module_1 = require("../storage/storage.module");
const site_content_schema_1 = require("./schemas/site-content.schema");
const site_content_controller_1 = require("./site-content.controller");
const site_content_service_1 = require("./site-content.service");
let SiteContentModule = class SiteContentModule {
};
exports.SiteContentModule = SiteContentModule;
exports.SiteContentModule = SiteContentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: site_content_schema_1.SiteContent.name, schema: site_content_schema_1.SiteContentSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchemaDefinition },
            ]),
            storage_module_1.StorageModule,
        ],
        controllers: [site_content_controller_1.SiteContentController],
        providers: [site_content_service_1.SiteContentService],
        exports: [site_content_service_1.SiteContentService],
    })
], SiteContentModule);
//# sourceMappingURL=site-content.module.js.map