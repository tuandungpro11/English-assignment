import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitAssignmentDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  assignmentSessionId: number;
  
  @ApiProperty({
    required: true,
    example: {
      "1": [2,1,3],
      "2": [4,3,6,2,1,5],
      "3": ["car"],
    }
  })
  @IsNotEmpty()
  answers: Record<string, unknown>;
}