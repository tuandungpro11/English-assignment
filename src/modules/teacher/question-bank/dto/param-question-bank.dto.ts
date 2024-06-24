import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ParamQuestionBankIdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  questionBankId: number;
}