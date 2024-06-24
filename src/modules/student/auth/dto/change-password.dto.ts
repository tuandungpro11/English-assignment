import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

