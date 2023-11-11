import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import * as fs from 'fs';

import { AppModule } from './app.module';
import * as process from 'process';

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/hr-bot.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/hr-bot.ddns.net/fullchain.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: process.env.ENV === 'development' ? null : httpsOptions,
  });
  app.enableCors({
    origin: [process.env.WEB_APP_URL, 'http://localhost:5173'],
  });
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
