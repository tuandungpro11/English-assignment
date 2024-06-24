import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class AddStudentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  classId: number;
  
  @ApiProperty({ type: [Number]})
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  studentIds: number[];
}