import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

import { OnboardingService } from './onboarding.service';
import { OnboardingEntity } from './onboarding.entity';
import { OnboardingScene } from './onboarding.scene';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingEntity]),
    UserModule,
    NotificationModule,
  ],
  providers: [OnboardingService, OnboardingScene],
  exports: [OnboardingService],
})
export class OnboardingModule {}
