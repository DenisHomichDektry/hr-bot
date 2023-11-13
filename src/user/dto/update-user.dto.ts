import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  role?: 'admin' | 'user';

  @IsOptional()
  @IsNumber()
  onboardingStep?: number;

  @IsOptional()
  @IsString()
  username?: string;
}
