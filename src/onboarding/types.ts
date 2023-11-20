import { UserEntity } from 'src/user/entities/user.entity';

import { OnboardingEntity, OnboardingProgressEntity } from './entities';

export interface IOnboardingProgressCreate {
  userId?: string;
  telegramId?: number;
  user?: UserEntity;
  onboardingStepId?: string;
  onboardingStep?: OnboardingEntity;
}

export interface IScheduleNotifications {
  oldOnboardingProgress?: OnboardingProgressEntity;
  newOnboardingProgress: OnboardingProgressEntity;
}
