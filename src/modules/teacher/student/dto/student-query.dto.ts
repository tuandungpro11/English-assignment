import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationOptions } from "src/shared/types/pagination-options.type";

export class FilterStudentDto extends PaginationOptions {
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
}

export class QueryStudentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  studentId: number;
}

export class QueryAssignmentStudentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  studentId: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  assignmentId: number;
}