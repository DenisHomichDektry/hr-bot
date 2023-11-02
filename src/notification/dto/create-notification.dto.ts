import { IsDateString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsDateString()
  sendAt: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  onboardingStepId: string;
}
