import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [process.env.WEB_APP_URL, 'http://localhost:5173'],
  });
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
