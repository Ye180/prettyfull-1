"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
exports.mongooseConfig = mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/prettyfull');
//# sourceMappingURL=mongoose.config.js.map