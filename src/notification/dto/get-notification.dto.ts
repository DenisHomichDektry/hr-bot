import { IsNumber, IsUUID } from 'class-validator';

export class GetNotificationDto {
  @IsUUID()
  userId?: string;

  @IsNumber()
  telegramId?: number;

  @IsUUID()
  onboardingStepId?: string;
}
