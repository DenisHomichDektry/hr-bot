import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetCategoryDto {
  @IsOptional()
  @IsUUID()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
