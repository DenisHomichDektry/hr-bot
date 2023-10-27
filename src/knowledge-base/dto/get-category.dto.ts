import { IsString } from 'class-validator';

export class GetCategoryDto {
  @IsString()
  name: string;
}
