import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertOnboardingItemDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsUrl()
  link: string;

  @IsInt()
  @Min(0)
  order: number;
}

export class UpsertOnboardingDto {
  @IsArray()
  @ArrayMinSize(1) // At least one item in the array
  @ValidateNested({ each: true })
  @Type(() => UpsertOnboardingItemDto)
  items: UpsertOnboardingItemDto[];
}
