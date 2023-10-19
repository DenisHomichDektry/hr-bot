import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUpdate } from './app.update';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    KnowledgeBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
