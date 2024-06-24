import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAssignmentDto {
  @ApiPropertyOptional()
  @IsString()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  @IsOptional()
  name: string;
  
  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value, 10))
  @IsOptional()
  totalMark: number;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value, 10))
  timeAllow: number;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  timeStart: Date;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  timeEnd: Date;
}
