"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const cart_dto_1 = require("./cart.dto");
class UpdateCartDto extends (0, mapped_types_1.PartialType)(cart_dto_1.CartItemDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCartDto = UpdateCartDto;
//# sourceMappingURL=update-cart.dto.js.map