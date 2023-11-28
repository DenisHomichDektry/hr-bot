import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { session } from 'telegraf';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
const { combine, timestamp, json, errors } = winston.format;
import 'winston-daily-rotate-file';

import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';
import { ormSource, store } from 'src/constants';
import { AuthGuard, RolesGuard } from 'src/auth/guards';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GlobalExceptionFilter } from './global-exception.filter';
import { AdminModule } from './admin/admin.module';
import { AppUpdate } from './app.update';
import { StartScene } from './start-scene.scene';
import { OnboardingModule } from './onboarding/onboarding.module';
import { NotificationModule } from './notification/notification.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MessageModule } from './message/message.module';

const fileRotateTransport = new winston.transports.DailyRotateFile({
  frequency: '6h',
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '100',
  maxSize: '5m',
  dirname: 'logs',
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
      middlewares: [session({ store })],
    }),
    TypeOrmModule.forRoot(ormSource),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      level: 'info',
      format: combine(timestamp(), errors({ stack: true }), json()),
      transports: [fileRotateTransport],
    }),
    KnowledgeBaseModule,
    AuthModule,
    UserModule,
    AdminModule,
    OnboardingModule,
    NotificationModule,
    FeedbackModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppUpdate,
    StartScene,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
