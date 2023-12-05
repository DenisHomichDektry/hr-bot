import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateItemDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsString()
  category?: string;
}

export class UpdateItemWebDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsUUID()
  categoryId: string;
}
