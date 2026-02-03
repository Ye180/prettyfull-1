"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSiteContentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_site_content_dto_1 = require("./create-site-content.dto");
class UpdateSiteContentDto extends (0, swagger_1.PartialType)(create_site_content_dto_1.CreateSiteContentDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSiteContentDto = UpdateSiteContentDto;
//# sourceMappingURL=update-site-content.dto.js.map