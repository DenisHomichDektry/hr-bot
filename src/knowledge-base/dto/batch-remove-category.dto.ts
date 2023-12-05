import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { RemoveCategoryDto } from './remove-category.dto';

export class BatchRemoveCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveCategoryDto)
  data: RemoveCategoryDto[];
}
