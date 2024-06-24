import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EditAnswerDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  assignmentId: number;
  
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  questionId: number;
  
  @ApiProperty({
    required: true,
    example: {
      "1": [2,1,3],
    }
  })
  @IsNotEmpty()
  answers: Record<string, unknown>;
}