import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class BatchUpsertCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchUpdateCategoryDto)
  data: BatchUpdateCategoryDto[];
}

export class BatchUpdateCategoryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;
}
