/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  API_PREFIX,
  API_VERSION,
  APP_DESCRIPTION,
  APP_NAME,
} from './common/constants';
import { swaggerSetup } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`${API_PREFIX}/`);

  // Redirect
  app.getHttpAdapter().get('', (req, res) => {
    res.redirect(`${API_PREFIX}/docs`);
  });

  // Setup Swagger
  swaggerSetup({
    app,
    metadata: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      globalPath: API_PREFIX,
      version: API_VERSION,
    },
  });

  // Redirect to Swagger API

  await app.listen(process.env.PORT ?? 7777);
}
void bootstrap();
