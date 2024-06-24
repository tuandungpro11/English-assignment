import { RedisService } from '@liaoliaots/nestjs-redis';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { Redis } from 'ioredis';
import { CACHE_CONSTANT } from 'src/shared/constants/cache.constant';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import type { JwtPayload } from 'src/modules/teacher/auth/dto/jwt-payload.dto';
import { IS_PUBLIC } from 'src/shared/decorators/auth.decorator';
import { BaseException } from 'src/shared/filters/exception.filter';
import { RoleRepository } from 'src/models/repositories';
import { Role } from '../enums/role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private redisInstance: Redis;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisService: RedisService,
    private readonly roleRepository: RoleRepository,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE,
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();

      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new BaseException(ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      const signature = token.split('.')[2];
      
      const idRoleTeacher = await this.roleRepository.getRoleId(Role.Teacher);
      const idRoleStudent = await this.roleRepository.getRoleId(Role.Student);
      
      if(payload.role === idRoleTeacher) {
        const isExistSignature = await this.redisInstance.hexists(
          `${CACHE_CONSTANT.SESSION_TEACHER_PREFIX}${payload.userId}`,
          signature,
        );
  
        if (!isExistSignature) {
          throw new BaseException(ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
      }
      
      if(payload.role === idRoleStudent) {
        const isExistSignature = await this.redisInstance.hexists(
          `${CACHE_CONSTANT.SESSION_STUDENT_PREFIX}${payload.userId}`,
          signature,
        );
  
        if (!isExistSignature) {
          throw new BaseException(ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
      }

      request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM] = payload;

      return true;
    } catch (error) {
      console.error(error);

      throw new BaseException(ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }
}
