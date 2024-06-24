import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  name: string;
  
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  classId: number;
  
  @ApiProperty({
    required: true
  })
  @IsNumber()
  @Transform(({ value }): number => parseInt(value, 10))
  totalMark: number;
  
  @ApiProperty({
    required: true
  })
  @IsNumber()
  @Transform(({ value }): number => parseInt(value, 10))
  timeAllow: number;
  
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  timeStart: Date;
  
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  timeEnd: Date;
}
