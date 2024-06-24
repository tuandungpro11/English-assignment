import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DirectMessageDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  studentId?: number;
  
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  teacherId?: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
