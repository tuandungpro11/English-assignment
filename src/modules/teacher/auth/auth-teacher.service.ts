import { plainToClass } from 'class-transformer';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import type { Redis } from 'ioredis';
import { CACHE_CONSTANT } from 'src/shared/constants/cache.constant';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ApiConfigService } from 'src/shared/services/api-config.service';

import type { JwtPayload } from './dto/jwt-payload.dto';
import type { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import {
  TeacherRepository,
  RoleRepository,
} from 'src/models/repositories';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthTeacherService {
  private redisInstance: Redis;

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly apiConfigService: ApiConfigService
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessExpires', { infer: true }),
      secret: this.configService.get('auth.accessSecret', { infer: true }),
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshExpires', { infer: true }),
      secret: this.configService.get('auth.refreshSecret', { infer: true }),
    });
  }
  
  async loginTeacher(loginRequest: LoginRequestDto): Promise<any> {
    const { email, password } = loginRequest;
    const teacher = await this.teacherRepository.createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.role', 'role')
      .where('teacher.email = :email', { email })
      .addSelect('teacher.password')
      .getOne();

    if (!teacher) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }

    const match = await compare(password, teacher.password);

    if (!match) {
      throw new BaseException(ERROR.WRONG_EMAIL_OR_PASSWORD);
    }
    
    const accessToken = this.generateAccessToken({
      userId: teacher.id,
      role: teacher.role.id,
    });

    const signatureAccessToken = accessToken.split('.')[2];

    const refreshToken = this.generateRefreshToken({
      userId: teacher.id,
      role: teacher.role.id,
    });

    const signatureRefreshToken = refreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${teacher.id}`,
      signatureAccessToken,
      signatureRefreshToken
    );

    return {
      teacher,
      token: {
        accessToken,
        refreshToken,
      }
    };
  }

  async logout(accessToken: string, userId: number): Promise<boolean> {
    const signature = accessToken.split('.')[2];
    const logoutResult = await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${userId}`,
      signature
    );

    return Boolean(logoutResult);
  }

  async revokeUser(userId: number): Promise<boolean> {
    const revokeResult = await this.redisInstance.del(
      `${CACHE_CONSTANT.SESSION_STUDENT_PREFIX}${userId}`
    );

    return Boolean(revokeResult);
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string
  ): Promise<LoginResponseDto> {
    const signatureAccessToken = accessToken.split('.')[2];
    const signatureRefreshToken = refreshToken.split('.')[2];

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('auth.refreshSecret', { infer: true }),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        payload = this.jwtService.decode(refreshToken) as JwtPayload;
        await this.redisInstance.hdel(
          `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${payload.userId}`,
          signatureAccessToken
        );

        throw new BaseException(ERROR.REFRESH_TOKEN_EXPIRED);
      } else {
        throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
      }
    }

    const signatureRefreshTokenCache = await this.redisInstance.hget(
      `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${payload.userId}`,
      signatureAccessToken
    );

    if (
      !signatureRefreshTokenCache ||
      signatureRefreshTokenCache !== signatureRefreshToken
    ) {
      throw new BaseException(ERROR.REFRESH_TOKEN_FAIL);
    }

    const newAccessToken = this.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newSignatureAccessToken = newAccessToken.split('.')[2];
    const newSignatureRefreshToken = newRefreshToken.split('.')[2];

    await this.redisInstance.hsetnx(
      `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${payload.userId}`,
      newSignatureAccessToken,
      newSignatureRefreshToken
    );

    await this.redisInstance.hdel(
      `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${payload.userId}`,
      signatureAccessToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  
  async changePassword(userId: number, oldPassword: string, newPassword: string) : Promise<boolean> {
    const user = await this.teacherRepository.findOne({ where: { id: userId }, select: ['password']});
    if(!user) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    const match = await compare(oldPassword, user.password);
    if(!match) {
      throw new BaseException(ERROR.INVALID_PASSWORD);
    }
    const hashPassword = await hash(
      newPassword,
      COMMON_CONSTANT.BCRYPT_SALT_ROUND
    );
    const { affected } = await this.teacherRepository.update({ id: userId }, {
      password: hashPassword
    })
    return affected > 0;
  }
}
