import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, NotContains, ValidateNested } from 'class-validator';
import { TYPE_QUESTION } from 'src/shared/enums/type-question.enum';

export class QuestionDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parentId: number;
  
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isParent: boolean;
  
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }): string | null => value?.trim())
  body: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }): string | null => value?.trim())
  choices: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }): string | null => value?.trim())
  instruction: string | null;
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @Transform(({ value }): string => value?.trim())
  response: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TYPE_QUESTION)
  type: TYPE_QUESTION
  
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  questionBankId: number;
}

export class CreateQuestionDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  assignmentId: number;
  
  @ApiProperty({ type: [QuestionDto] })
  @ValidateNested()
  @IsArray()
  @Type(() => QuestionDto)
  questions: QuestionDto[]
}

export class CreateQuestionBankDto {
  @ApiProperty({ type: [QuestionDto] })
  @ValidateNested()
  @IsArray()
  @Type(() => QuestionDto)
  questions: QuestionDto[]
}