import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class RemoveStudentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  classId: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  studentId: number;
}