import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { OnboardingEntity } from 'src/onboarding/entities/onboarding.entity';

import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackScene } from './feedback.scene';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity, OnboardingEntity]),
    UserModule,
    NotificationModule,
  ],
  providers: [FeedbackService, FeedbackScene],
  exports: [FeedbackService],
})
export class FeedbackModule {}
