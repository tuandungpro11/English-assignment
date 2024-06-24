import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { GENDER } from "src/shared/enums/gender.enum";

export class UpdateInformationTeacherDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar: Express.Multer.File;
}