import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationOptions } from "src/shared/types/pagination-options.type";

export class FilterQuestionDto extends PaginationOptions {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }): string => value?.trim())
  search: string;
  
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