import { IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsString()
  link: string;

  @IsString()
  category: string;
}

export class CreateItemWebDto {
  @IsString()
  title: string;

  @IsString()
  link: string;

  @IsUUID()
  categoryId: string;
}
