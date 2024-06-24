import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartAssignmentDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  assignmentId: number;
  
  // @ApiProperty({
  //   required: true,
  // })
  // @IsNumber()
  // @Type(() => Number)
  // @IsNotEmpty()
  // classId: number;
}