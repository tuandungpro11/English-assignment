import { Injectable } from "@nestjs/common";
import { StudentEntity } from "../entities/student.entity";
import { FindManyOptions, In, IsNull, LessThan, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { AssignmentSessionEntity } from "../entities";
import { transformToPlain } from "src/shared/transformers/class-to-plain.transformer";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { StatusAssignmentSession } from "src/shared/enums/status.enum";
import _ from 'lodash';
import { QueryAssignmentDto } from "src/modules/student/assignment/dto/query-assignment.dto";

@Injectable()
export class AssignmentSessionRepository extends Repository<AssignmentSessionEntity> {
  constructor(
    @InjectRepository(AssignmentSessionEntity)
    private readonly repository: Repository<AssignmentSessionEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getSessionById(assignmentSessionId: number): Promise<AssignmentSessionEntity> {
    const assignmentSession = await this.repository.findOne({ where: { id: assignmentSessionId } });
    if(!assignmentSession) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return transformToPlain<AssignmentSessionEntity>(assignmentSession);
  }
  
  async getSessionAllStatus(studentId: number, assignmentId: number): Promise<AssignmentSessionEntity> {
    const assignmentSession = await this.repository.findOne({
      where: {
        student: {
          id: studentId
        },
        assignment: {
          id: assignmentId
        }
      }
    })
    return transformToPlain<AssignmentSessionEntity>(assignmentSession);
  }
  
  async getListSessionsUnfinished() {
    const assignmentSessions = await this.repository.find({
      where: {
        status: Not(StatusAssignmentSession.COMPLETED),
        invalidAt: LessThan(new Date())
      },
      withDeleted: true
    })
    return transformToPlain<AssignmentSessionEntity[]>(assignmentSessions)
  }
  
  async getListCompletedSession(studentId: number, assignmentIds: number[]): Promise<any> {
    const assignmentsSession = await this.repository.find({
      where: {
        student: {
          id: studentId
        },
        assignment: {
          id: In(assignmentIds)
        },
        status: StatusAssignmentSession.COMPLETED
      }
    })
    if(assignmentsSession.length > 0) {
      return _.map(assignmentsSession, 'assignment')
    }
    return []
  }
  
  async getListAssignmentCompleted(studentId: number) {
    const assignmentSessions = await this.repository.find({
      where: {
        student: {
          id: studentId
        },
        status: StatusAssignmentSession.COMPLETED,
        assignment: {
          class: Not(IsNull())
        }
      }
    })
    return transformToPlain<AssignmentSessionEntity[]>(assignmentSessions)
  }
  
  async getAssignmentCompleted(studentId: number, assignmentId: number)  {
    const assignmentSession = await this.repository.findOne({
      where: {
        student: {
          id: studentId
        },
        assignment: {
          id: assignmentId
        },
        status: StatusAssignmentSession.COMPLETED
      }
    })
    return transformToPlain<AssignmentSessionEntity>(assignmentSession)
  }
  
  async getListSessionByAssignment(queryAssignment: QueryAssignmentDto) {
    const { assignmentId, limit } = queryAssignment
    const queryOptions = {
      where: {
        assignment: {
          id: assignmentId
        },
        status: StatusAssignmentSession.COMPLETED
      },
      order: {
        mark: "DESC"
      }
    };
    if (limit !== undefined && limit !== null) {
      queryOptions['take'] = limit;
    }
    const assignmentSessions = await this.repository.find(queryOptions as FindManyOptions<AssignmentSessionEntity>);
    return transformToPlain<AssignmentSessionEntity[]>(assignmentSessions);
  }
  
  async getAssignmentCompletedInClass(studentId: number, classId: number)  {
    const assignmentSession = await this.repository.find({
      where: {
        student: {
          id: studentId
        },
        assignment: {
          class: {
            id: classId
          }
        },
        status: StatusAssignmentSession.COMPLETED
      }
    })
    return transformToPlain<AssignmentSessionEntity[]>(assignmentSession)
  }
}