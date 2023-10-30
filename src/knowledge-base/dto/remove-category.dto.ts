import { IsString, IsUUID } from 'class-validator';

export class RemoveCategoryDto {
  @IsUUID()
  @IsString()
  id: string;
}
