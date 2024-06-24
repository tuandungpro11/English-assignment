import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class QueryAssignmentDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  assignmentId: number;
  
  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;
}

export class QueryQuestionDto {
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
}