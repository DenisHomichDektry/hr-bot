import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DeleteUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsNumber()
  telegramId?: number;
}
