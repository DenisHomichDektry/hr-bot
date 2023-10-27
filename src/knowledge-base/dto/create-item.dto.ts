import { IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsString()
  link: string;

  @IsString()
  category: string;
}
