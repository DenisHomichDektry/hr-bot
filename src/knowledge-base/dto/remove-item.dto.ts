import { IsString, IsUUID } from 'class-validator';

export class RemoveItemDto {
  @IsUUID()
  @IsString()
  id: string;
}
