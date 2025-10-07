import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { swaggerSetup } from './shared/config/swagger.config';
import {
  API_PREFIX,
  API_VERSION,
  APP_DESCRIPTION,
  APP_NAME,
} from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept-Language',
      'Accept-Currency',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Redirect root to API docs
  app.getHttpAdapter().get('', (req, res) => {
    res.redirect(`/${apiPrefix}/docs`);
  });

  // Setup Swagger documentation
  swaggerSetup({
    app,
    metadata: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      globalPath: apiPrefix,
      version: API_VERSION,
    },
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port, () => {
    console.log(`🚀 E-commerce API server started at http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
  });
}
void bootstrap();
