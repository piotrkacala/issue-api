import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Category, Status } from '../enums';

export class CreateTrackerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Status)
  status?: string;

  @IsEnum(Category)
  category: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;

  @IsInt()
  @IsOptional()
  parentId?: number;
}
