import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

import { OnboardingService } from './onboarding.service';
import { OnboardingEntity } from './onboarding.entity';
import { OnboardingScene } from './onboarding.scene';
import { OnboardingController } from './onboarding.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingEntity]),
    UserModule,
    NotificationModule,
  ],
  providers: [OnboardingService, OnboardingScene],
  exports: [OnboardingService],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
