import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetAllItemsDto {
  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
