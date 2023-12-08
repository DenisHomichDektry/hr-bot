import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsNumber()
  telegramId?: number;
}
