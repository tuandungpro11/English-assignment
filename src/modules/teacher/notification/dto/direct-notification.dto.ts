import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DirectNotificationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  classId: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
