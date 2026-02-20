"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const config_1 = require("@nestjs/config");
exports.envConfig = config_1.ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
});
//# sourceMappingURL=env.config.js.map