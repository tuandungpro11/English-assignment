import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class MapStudentAnswerDto {
  answer: string;
  
  isCorrect: boolean
}
