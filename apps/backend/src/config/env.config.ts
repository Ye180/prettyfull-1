/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigModule } from '@nestjs/config';

export const envConfig = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});
