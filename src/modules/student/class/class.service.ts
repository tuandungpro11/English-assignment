import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignmentRepository, AssignmentSessionRepository, ClassRepository } from 'src/models/repositories';
import { FilterAssignmentDto } from 'src/modules/teacher/assignment/dto/assignment-query.dto';
import { FilterClassDto } from 'src/modules/teacher/class/dto/class-query.dto';
import { StatusAssignment } from 'src/shared/enums/status.enum';
import _ from 'lodash';
import { AssignmentService } from '../assignment/assignment.service';

@Injectable()
export class ClassService {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly assignmentService: AssignmentService
  ) {}
  async getMyClasses(studentId: number, filterClass: FilterClassDto) {
    const classes = await this.classRepository.getListClassesByStudent(studentId, filterClass);
    return classes;
  }
  
  async getAssignments(studentId: number, classId: number, filterAssignment: FilterAssignmentDto) {
    const { status } = filterAssignment;
    if(_.isNull(status) || _.isUndefined(status)) {
      throw new BadRequestException('status không được để trống');
    }
    
    if(status === StatusAssignment.COMPLETED) {
      filterAssignment.studentId = studentId;
      const assignments = await this.assignmentRepository.getListAssignmentByClass(classId, filterAssignment);
      return assignments
    } else {
      const assignments = await this.assignmentRepository.getListAssignmentByClass(classId, filterAssignment);
      if(assignments.length > 0) {
        const assignmentCompleted = await this.assignmentSessionRepository.getListCompletedSession(studentId, _.map(assignments, 'id'));
        const result = _.filter(assignments, (assignment) => {
          return !_.find(assignmentCompleted, { id: assignment.id });
        })
        return result
      }
      return assignments
    }
  }
  
  async analysisResultStudent(studentId: number, classId: number) {
    const assignmentSessions = await this.assignmentSessionRepository.getAssignmentCompletedInClass(studentId, classId);
    let listResultAssignment = [];
    if(assignmentSessions.length > 0) {
      const results = await Promise.all(assignmentSessions.map(async (assignmentSession) => {
        return this.assignmentService.handleResultAssignment(assignmentSession);
      }));
      listResultAssignment = _.flatMap(results, (result) => result.questions);
      const groupedByType = _.groupBy(listResultAssignment, 'type');
      const data = _.map(groupedByType, (items, type) => {
        return {
          type: parseInt(type),
          count: items.length,
          correctCount: _.filter(items, { isCorrect: true }).length
        }
      })
      return data
    }
    return "Không có dữ liệu. Hãy hoàn thành các assignment để có kết quả phân tích"
  }
}
