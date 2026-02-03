"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const address_dto_1 = require("./address.dto");
class UpdateAddressDto extends (0, mapped_types_1.PartialType)(address_dto_1.AddressDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAddressDto = UpdateAddressDto;
//# sourceMappingURL=update-product.dto.js.map