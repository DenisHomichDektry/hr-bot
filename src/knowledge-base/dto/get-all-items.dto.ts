import { IsOptional, IsString } from 'class-validator';

export class GetAllItemsDto {
  @IsOptional()
  @IsString()
  categoryName: string;
}
