import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateItemDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
