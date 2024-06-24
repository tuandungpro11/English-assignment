import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  name: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
}
