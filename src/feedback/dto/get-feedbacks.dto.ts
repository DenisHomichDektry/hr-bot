import { IsNumberString, IsOptional } from 'class-validator';

export class GetFeedbacksDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
