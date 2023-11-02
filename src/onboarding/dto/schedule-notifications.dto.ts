import { IsNumber, IsObject, IsUUID } from 'class-validator';

import { OnboardingEntity } from '../onboarding.entity';

export class ScheduleNotificationsDto {
  // at least one of the two properties must be present
  @IsUUID()
  userId?: string;

  @IsNumber()
  telegramId?: number;

  @IsObject()
  onboardingStep: OnboardingEntity;
}
