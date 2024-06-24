import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { GENDER } from "src/shared/enums/gender.enum";

export class UpdateInformationStudentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEnum(GENDER)
  gender: GENDER

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar: Express.Multer.File;
}