import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetNotificationDto {
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  page: number = 1;
}
