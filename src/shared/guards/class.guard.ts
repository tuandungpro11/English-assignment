import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { ERROR } from 'src/shared/exceptions';
import type { Role } from 'src/shared/enums/role.enum';
import { ROLES_KEY } from 'src/shared/decorators/auth.decorator';
import { BaseException } from 'src/shared/filters/exception.filter';
import { getRoleByIndex } from '../utils/utils';
import {
  ClassRepository,
  ClassStudentRepository,
  StudentRepository,
} from 'src/models/repositories';
import { Request } from 'express';

@Injectable()
export class ClassGuard implements CanActivate {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classStudentRepository: ClassStudentRepository,
    private readonly studentRepository: StudentRepository,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request[COMMON_CONSTANT.JWT_DECODED_REQUEST_PARAM].userId;
    const classId = request.query['classId'] || request.params['classId'];
    if (!classId) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    const classroom = await this.classRepository.getClassById(parseInt(classId, 10));
    const student = await this.studentRepository.getStudentById(userId);
    const isParticipant = await this.classStudentRepository.isClassParticipant(student.id, classroom.id);
    if(!isParticipant) {
      throw new BaseException(ERROR.CLASS_NOT_FOUND);
    }
    return true;
  }
}
