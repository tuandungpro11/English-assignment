import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Public,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { AuthTeacherService } from './auth-teacher.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from './dto/refresh-token.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { RevokeUserRequestDto, RevokeUserResponseDto } from './dto/revoke-user.dto';
import { ChangePasswordDto } from 'src/modules/student/auth/dto/change-password.dto';

@Controller('teacher/auth')
@ApiTags('Teacher | Auth')
export class AuthTeacherController {
  constructor(private readonly authTeacherService: AuthTeacherService) {}
  
  @ApiOperation({
    summary: 'Login Teacher',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @Post('login')
  @Public()
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authTeacherService.loginTeacher(loginRequestDto);
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
    return this.authTeacherService.refreshToken(
      refreshTokenRequestDto.accessToken,
      refreshTokenRequestDto.refreshToken,
    );
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
    const logoutResult = await this.authTeacherService.logout(token, data.userId);

    return {
      logoutResult,
    };
  }

  @ApiOperation({
    summary: 'Revoke user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RevokeUserResponseDto,
  })
  @ApiBearerAuth()
  @Post('revoke-user')
  @Roles([Role.Teacher])
  async revokeUser(
    @Body() revokeUserRequestDto: RevokeUserRequestDto,
  ): Promise<RevokeUserResponseDto> {
    const revokeResult = await this.authTeacherService.revokeUser(
      revokeUserRequestDto.id,
    );

    return {
      revokeResult,
    };
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
    return this.authTeacherService.changePassword(data.userId, oldPassword, newPassword);
  }
}
