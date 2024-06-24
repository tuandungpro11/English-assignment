import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import type { Role } from 'src/shared/enums/role.enum';
import type { JwtPayload } from 'src/modules/teacher/auth/dto/jwt-payload.dto';

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const ROLES_KEY = 'roles';
export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const JwtDecodedData = createParamDecorator(
  (data: string, ctx: ExecutionContext): JwtPayload => {
    const request: Request = ctx.switchToHttp().getRequest();

    return request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM];
  },
);
