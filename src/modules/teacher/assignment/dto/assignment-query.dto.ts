import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusAssignment } from "src/shared/enums/status.enum";
import { PaginationOptions } from "src/shared/types/pagination-options.type";

export class FilterAssignmentDto extends PaginationOptions {
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
  
  @ApiPropertyOptional({
    enum: StatusAssignment,
  })
  @IsOptional()
  @IsEnum(StatusAssignment)
  @Type(() => Number)
  status: StatusAssignment
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  studentId: number;
}