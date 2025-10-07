/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
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

  app.setGlobalPrefix(`${API_PREFIX}/`);

  // Redirect to Swagger API
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

  await app.listen(process.env.PORT ?? 7777, () =>
    console.log(
      `🚀 Server started at http://localhost:${process.env.PORT ?? 7777}`,
    ),
  );
}
void bootstrap();
