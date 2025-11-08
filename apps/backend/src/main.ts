import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { swaggerSetup } from './shared/config/swagger.config';
import { API_VERSION, APP_DESCRIPTION, APP_NAME } from './shared/constants';

async function bootstrap() {
  // Disable body parser for Better Auth to handle raw request body
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);

  // Security middlewares
  app.use(helmet());

  app.use(compression());

  // const allowedOrigins = configService
  //   .get<string>('CORS_ORIGIN', 'http://localhost:3000')
  //   .split(',')
  //   .map((origin) => origin.trim());
  // // CORS configuration
  // app.enableCors({
  //   origin: allowedOrigins,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'Authorization',
  //     'Accept-Language',
  //     'Accept-Currency',
  //   ],
  // });

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
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Redirect root to API docs
  app.getHttpAdapter().get('', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

  const port = configService.get<number>('PORT', 7777);
  await app.listen(port, () => {
    console.log(`🚀 E-commerce API server started at http://localhost:${port}`);
    console.log(
      `📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`,
    );
  });
}
void bootstrap();
