import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsDateString()
  sendAt: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  telegramId?: number;

  @IsUUID()
  onboardingStepId: string;
}
