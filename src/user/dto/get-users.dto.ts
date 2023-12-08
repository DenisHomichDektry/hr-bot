import { IsNumberString, IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}
