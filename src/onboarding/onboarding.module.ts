import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OnboardingService } from './onboarding.service';
import { OnboardingEntity } from './onboarding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingEntity])],
  providers: [OnboardingService],
})
export class OnboardingModule {}
