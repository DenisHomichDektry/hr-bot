import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { UserEntity } from 'src/user/entities/user.entity';

import { OnboardingProgressService, OnboardingService } from './services';
import { OnboardingEntity, OnboardingProgressEntity } from './entities';
import { OnboardingScene } from './onboarding.scene';
import { OnboardingController } from './onboarding.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OnboardingEntity,
      OnboardingProgressEntity,
      UserEntity,
    ]),
    UserModule,
    NotificationModule,
    FeedbackModule,
  ],
  providers: [OnboardingService, OnboardingProgressService, OnboardingScene],
  exports: [OnboardingService, OnboardingProgressService],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
