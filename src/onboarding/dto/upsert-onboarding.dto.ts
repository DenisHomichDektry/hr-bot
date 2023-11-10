import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class UpsertOnboardingItemDto {
  @IsUUID()
  id: string;

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
  items: UpsertOnboardingItemDto[];
}
