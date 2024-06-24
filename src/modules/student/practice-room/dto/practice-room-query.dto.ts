import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TYPE_ASSIGNMENT } from "src/shared/enums/type-assignment.enum";
import { PaginationOptions } from "src/shared/types/pagination-options.type";

export class FilterPracticeRoomDto extends PaginationOptions {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  search: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TYPE_ASSIGNMENT)
  @Type(() => Number)
  type: TYPE_ASSIGNMENT;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  createdAt: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  startDate: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  endDate: string;
}