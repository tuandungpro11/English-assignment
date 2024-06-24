import { Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import {
  AssignmentSessionRepository,
  CommentRepository,
  StudentRepository,
} from 'src/models/repositories';
import _ from 'lodash';
import { compare, hash } from 'bcryptjs';
import { COMMON_CONSTANT } from 'src/shared/constants';
import { FilterStudentDto, QueryAssignmentStudentDto } from './dto/student-query.dto';
import { AssignmentService } from 'src/modules/student/assignment/assignment.service';

@Injectable()
export class ManageStudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly commentRepository: CommentRepository,
    private readonly assignmentService: AssignmentService
  ) {}

  async getInformationStudent(studentId: number) {
    const student = await this.studentRepository.getStudentById(studentId);
    return student;
  }
  
  async getListStudent(filterStudent: FilterStudentDto) {
    const students = await this.studentRepository.getListStudent(filterStudent);
    return students;
  }

  async deleteStudent(studentId: number) {
    const { affected } = await this.studentRepository.delete({ id: studentId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
  
  async getListAssignmentStudent(studentId: number) {
    const assignmentCompleted = await this.assignmentSessionRepository.getListAssignmentCompleted(studentId);
    return _.map(assignmentCompleted, (assignment) => {
      return _.omit(assignment, ['studentAnswer'])
    });
  }
  
  async getAssignmentStudent(queryAssignmentStudent: QueryAssignmentStudentDto) {
    const { studentId, assignmentId } = queryAssignmentStudent;
    const student = await this.studentRepository.getStudentById(studentId);
    const assignmentSession = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, assignmentId);
    if(!assignmentSession) {
      // throw new BaseException(ERROR.ASSIGNMENT_NOT_EXIST);
      throw new BaseException(ERROR.NOT_FOUND);
    }
    const result = await this.assignmentService.handleResultAssignment(assignmentSession);
    const comments = await this.commentRepository.getListCommentByAssignment(assignmentSession.id);
    return {
      ...result,
      student,
      comments: _.map(comments, (comment) => _.omit(comment, ['assignmentSession']))
    }
  }
}