import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class AddCommentAssignmentDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  assignmentSessionId: number;
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  body: string;
}