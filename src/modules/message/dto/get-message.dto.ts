import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetMessageDto {
  @IsNumber()
  @Type(() => Number)
  limit: number = 20;

  @IsNumber()
  @Type(() => Number)
  page: number = 1;
}
