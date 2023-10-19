import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';
import { ormSource } from 'src/constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUpdate } from './app.update';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
    }),
    TypeOrmModule.forRoot(ormSource),
    KnowledgeBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
