import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { OnboardingEntity } from 'src/onboarding/onboarding.entity';

import { MessageEntity } from './message.entity';
import { MessageService } from './message.service';
import { AssistanceScene, ReplyScene } from './scenes';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, OnboardingEntity]),
    UserModule,
    NotificationModule,
  ],
  providers: [MessageService, AssistanceScene, ReplyScene],
})
export class MessageModule {}
