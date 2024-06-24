import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength, NotContains } from 'class-validator';
import { GENDER } from 'src/shared/enums/gender.enum';

export class RegisterRequestDto {
  @ApiProperty({
    required: true,
    example: 'student@gmail.com',
  })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }): string => value?.trim())
  @MinLength(2)
  @MaxLength(25)
  name: string;
  
  @ApiProperty({
    required: true,
    enum: Object.keys(GENDER),
    example: GENDER.MALE
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER
  
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string
}

export class RegisterResponseDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string
}
