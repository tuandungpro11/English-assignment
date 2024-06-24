import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationOptions } from "src/shared/types/pagination-options.type";

export class FilterMessageDto extends PaginationOptions {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  studentId: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  teacherId: number;
}