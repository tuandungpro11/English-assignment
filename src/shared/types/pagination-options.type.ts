import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationOptions {
  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page: number = 1;
  
  @ApiPropertyOptional({ default: "createdAt" })
  @IsString()
  @IsOptional()
  sortBy: string;
  
  @ApiPropertyOptional({ default: "DESC" })
  @IsString()
  @IsOptional()
  sortOrder: string = 'DESC';
}

export class PaginationResponse<T> {
  data: T[];
  metadata: {
    total: number;
    totalPage: number;
    page: number;
  };
}