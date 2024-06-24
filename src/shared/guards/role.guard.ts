import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import type { Role } from 'src/shared/enums/role.enum'
import { ROLES_KEY } from 'src/shared/decorators/auth.decorator';
import { BaseException } from 'src/shared/filters/exception.filter';
import { getRoleByIndex } from '../utils/utils';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const decoded = context.switchToHttp().getRequest()[
      COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM
    ];

    if (!requiredRoles.includes(getRoleByIndex(decoded.role))) {
      throw new BaseException(ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
