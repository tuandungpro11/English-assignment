import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ParamCommentIdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  commentId: number;
}