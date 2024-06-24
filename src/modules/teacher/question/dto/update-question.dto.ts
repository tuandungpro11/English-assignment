import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  body: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  choices: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  instruction: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }): string => value?.trim())
  response: string;
}
