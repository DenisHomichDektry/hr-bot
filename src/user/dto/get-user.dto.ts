import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsNumber()
  telegramId?: number;
}
