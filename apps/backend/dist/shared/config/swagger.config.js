"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = void 0;
const swagger_1 = require("@nestjs/swagger");
const swaggerSetup = ({ app, metadata: { title, description, globalPath, version = '1.0' }, }) => {
    const options = new swagger_1.DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`${globalPath}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
};
exports.swaggerSetup = swaggerSetup;
//# sourceMappingURL=swagger.config.js.map