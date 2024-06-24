import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ERROR } from '../exceptions';
import { BaseException } from '../filters/exception.filter';

@Injectable()
export class AuthenticatedWsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient();
      return !!client.handshake.auth?.studentId || !!client.handshake.auth?.teacherId;
    } catch (error) {
      //TODO: handle error
      throw new BaseException(ERROR.UNAUTHORIZED)
    }
  }
}
