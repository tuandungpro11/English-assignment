import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { AssignmentRepository, AssignmentSessionRepository, ClassRepository } from 'src/models/repositories';
import { AssignmentEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import _ from 'lodash'
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { isBefore } from 'date-fns';
import { FilterAssignmentDto } from './dto/assignment-query.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class ManageAssignmentService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly classRepository: ClassRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}

  async createAssignment(createAssignment: CreateAssignmentDto) {
    const { classId, ...assignmentProperties } = createAssignment;
    const classroom = await this.classRepository.getClassById(classId);
    if(isBefore(new Date(assignmentProperties.timeEnd), new Date(assignmentProperties.timeStart))) {
      throw new BadRequestException('Thời gian bắt đầu không thể sau thời gian kết thúc');
    }
    const newAssignment = new AssignmentEntity();
    newAssignment.class = classroom;
    Object.assign(newAssignment, {
      ...assignmentProperties
    });
    
    const assignment = await this.assignmentRepository.save(newAssignment);
    return {
      ..._.omit(assignment, ['class']),
      class: {
        ..._.omit(assignment.class, ['creator'])
      }
    }
  }
  
  async getAssignment(assignmentId: number): Promise<any> {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);
    const assignmentSessions = await this.assignmentSessionRepository.getListSessionByAssignment({ assignmentId, limit: null });
    return {
      assignment,
      assignmentSessions: _.map(assignmentSessions, (assignmentSession) => {
        return _.omit(assignmentSession, ['assignment', 'studentAnswer'])
      })
    };
  }
  
  async getListAssignment(classId: number, filterAssignment: FilterAssignmentDto) {
    const assignments = await this.assignmentRepository.getListAssignmentByClassWithMetadata(classId, filterAssignment);
    return assignments;
  }
  
  async updateInformationAssignment(assignmentId: number, updateAssignment: UpdateAssignmentDto) {
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);
    let tmpTimeStart = assignment.timeStart;
    let tmpTimeEnd = assignment.timeEnd;
    if(updateAssignment.timeStart && !updateAssignment.timeEnd) {
      tmpTimeStart = updateAssignment.timeStart;
    } else if(!updateAssignment.timeStart && updateAssignment.timeEnd) {
      tmpTimeEnd = updateAssignment.timeEnd;
    } else {
      tmpTimeStart = updateAssignment.timeStart;
      tmpTimeEnd = updateAssignment.timeEnd;
    }
    if(isBefore(new Date(tmpTimeEnd), new Date(tmpTimeStart))) {
      throw new BadRequestException('Thời gian bắt đầu không thể sau thời gian kết thúc');
    }
    return await this.assignmentRepository.save({
      ...assignment,
      ...updateAssignment
    })
  }
  
  async deleteAssignment(assignmentId: number) {
    const { affected } = await this.assignmentRepository.delete({ id: assignmentId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
}
