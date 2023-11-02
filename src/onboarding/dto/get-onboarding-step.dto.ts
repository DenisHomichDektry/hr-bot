import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetOnboardingStepDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
