import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface DocMetadata {
  title: string;
  description: string;
  version?: string;
  globalPath: string;
}

export const swaggerSetup = ({
  app,
  metadata: { title, description, globalPath, version = '1.0' },
}: {
  app: INestApplication;
  metadata: DocMetadata;
}) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    // .addSecurity('optional-auth', {
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    //   description: 'Optional JWT token for enhanced features',
    // })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${globalPath}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
};
