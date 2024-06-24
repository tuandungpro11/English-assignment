import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { AuthStudentService } from './auth-student.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from './dto/refresh-token.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { RevokeUserRequestDto, RevokeUserResponseDto } from './dto/revoke-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@ApiTags('Student | Auth')
export class AuthStudentController {
  constructor(private readonly authStudentService: AuthStudentService) {}

  @ApiOperation({
    summary: 'Login Student',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @Post('login')
  @Public()
  async loginStudent(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authStudentService.loginStudent(loginRequestDto);
  }
  
  @ApiOperation({
    summary: 'Register a new student',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterResponseDto,
  })
  @Post('register')
  @Public()
  async registerStudent(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authStudentService.registerStudent(registerRequestDto);
  }

  @ApiOperation({
    summary: 'Refresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokenResponseDto,
  })
  @ApiBearerAuth()
  @Post('refresh-token')
  @Public()
  refreshToken(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authStudentService.refreshToken(
      refreshTokenRequestDto.accessToken,
      refreshTokenRequestDto.refreshToken,
    );
  }
  
  @ApiOperation({
    summary: 'Change password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
  })
  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() changePassword: ChangePasswordDto,
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    const { oldPassword, newPassword } = changePassword;
    return this.authStudentService.changePassword(data.userId, oldPassword, newPassword);
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LogoutResponseDto,
  })
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @JwtDecodedData() data: JwtPayload,
  ): Promise<LogoutResponseDto> {
    const token = req.headers.authorization.split(' ')[1];
    const logoutResult = await this.authStudentService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }
}
