import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetUserRoleDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: 'admin' | 'user';
}
