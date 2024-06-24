import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TYPE_ASSIGNMENT } from 'src/shared/enums/type-assignment.enum';

export class StartPracticeRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  assignmentId: number;
  
  @ApiProperty({
    required: true
  })
  @IsNumber()
  @Type(() => Number)
  timeAllow: number;
  
  @ApiProperty({
    required: true
  })
  @IsNumber()
  @Type(() => Number)
  questionCount: number;
  
  @ApiProperty({
    required: true
  })
  @IsNumber()
  @IsEnum(TYPE_ASSIGNMENT)
  type: TYPE_ASSIGNMENT
}