import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { StatusAssignment } from "src/shared/enums/status.enum";

export class QueryStatusAssignmentDto {
  @ApiProperty({
    required: true,
    enum: StatusAssignment,
  })
  @IsNotEmpty()
  @IsEnum(StatusAssignment)
  status: StatusAssignment
}