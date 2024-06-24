import { Injectable } from "@nestjs/common";
import { StudentEntity } from "../entities/student.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { AssignmentEntity, ClassEntity } from "../entities";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { transformToPlain } from "src/shared/transformers/class-to-plain.transformer";
import { FilterAssignmentDto } from "src/modules/teacher/assignment/dto/assignment-query.dto";
import { endOfDay, startOfDay } from "date-fns";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { StatusAssignment, StatusAssignmentSession } from "src/shared/enums/status.enum";
import { FilterPracticeRoomDto } from "src/modules/student/practice-room/dto/practice-room-query.dto";
import { TYPE_ASSIGNMENT } from "src/shared/enums/type-assignment.enum";

@Injectable()
export class AssignmentRepository extends Repository<AssignmentEntity> {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly repository: Repository<AssignmentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getAssignmentById(id: number): Promise <AssignmentEntity> {
    const assignment = await this.findOne({ where: { id } });
    if(!assignment) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return transformToPlain<AssignmentEntity>(assignment);
  }
  
  async getListAssignmentByClass(classId: number, filterAssignment: FilterAssignmentDto): Promise<any> {
    const { search, sortBy, sortOrder, startDate, endDate, createdAt, status, studentId } = filterAssignment;
    const query = this.createQueryBuilder('assignment')
    query.andWhere('assignment.class = :classId', { classId });
    if(studentId) {
      query.leftJoin('assignment.assignmentSession', 'assignmentSession')
      query.andWhere('assignmentSession.student = :studentId', { studentId });
      query.andWhere('assignmentSession.status = :status', { status: StatusAssignmentSession.COMPLETED })
    }
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`assignment.${sortBy}`, order);
    } else {
      query.orderBy(`assignment.createdAt`, order);
    }
    if (search) {
      query.andWhere('assignment.name ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(assignment.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(assignment.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(assignment.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(assignment.timeStart) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }
    
    // if(status === StatusAssignment.ACTIVE) {
    //   query.andWhere('assignment.timeStart <= :now AND assignment.timeEnd >= :now', { now: new Date() });
    // } else if(status === StatusAssignment.EXPIRED) {
    //   query.andWhere('assignment.timeEnd < :now', { now: new Date() });
    // }
    
    if(status === StatusAssignment.EXPIRED) {
      query.andWhere('assignment.timeEnd < :now', { now: new Date() });
    }

    const data = await query.getMany();
    return data
  }
  
  async getListAssignmentByClassWithMetadata(classId: number, filterAssignment: FilterAssignmentDto): Promise<any> {
    const { search, sortBy, sortOrder, startDate, endDate, createdAt, status, studentId, limit, page } = filterAssignment;
    const query = this.createQueryBuilder('assignment')
    query.andWhere('assignment.class = :classId', { classId });
    if(studentId) {
      query.leftJoin('assignment.assignmentSession', 'assignmentSession')
      query.andWhere('assignmentSession.student = :studentId', { studentId });
      query.andWhere('assignmentSession.status = :status', { status: StatusAssignmentSession.COMPLETED })
    }
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`assignment.${sortBy}`, order);
    } else {
      query.orderBy(`assignment.createdAt`, order);
    }
    if (search) {
      query.andWhere('assignment.name ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(assignment.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(assignment.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(assignment.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(assignment.timeStart) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }
    
    if(status === StatusAssignment.ACTIVE) {
      query.andWhere('assignment.timeStart <= :now AND assignment.timeEnd >= :now', { now: new Date() });
    } else if(status === StatusAssignment.EXPIRED) {
      query.andWhere('assignment.timeEnd < :now', { now: new Date() });
    }
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);

    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
  
  async getListAssignmentByPracticeRoom(studentId: number, filterPracticeRoom: FilterPracticeRoomDto): Promise<AssignmentEntity[]> {
    const { page, limit, search, sortBy, sortOrder, startDate, endDate, createdAt, type } = filterPracticeRoom;
    const query = this.createQueryBuilder('assignment')
    query.leftJoin('assignment.assignmentSession', 'assignmentSession')
    query.andWhere('assignmentSession.student = :studentId', { studentId });
    if(!type) {
      query.andWhere('assignment.type = :type', { type: TYPE_ASSIGNMENT.RANDOM });
    } else {
      query.andWhere('assignment.type = :type', { type });
    }
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`assignment.${sortBy}`, order);
    } else {
      query.orderBy(`assignment.createdAt`, order);
    }
    if (search) {
      query.andWhere('assignment.name ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(assignment.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(assignment.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(assignment.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(assignment.timeStart) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }
    
    const data = await query.getMany();
    return data;
  }
  
  async getListAssignmentByPracticeRoomWithMetadata(studentId: number, filterPracticeRoom: FilterPracticeRoomDto): Promise<any> {
    const { page, limit, search, sortBy, sortOrder, startDate, endDate, createdAt, type } = filterPracticeRoom;
    const query = this.createQueryBuilder('assignment')
    query.leftJoin('assignment.assignmentSession', 'assignmentSession')
    query.andWhere('assignmentSession.student = :studentId', { studentId });
    if(!type) {
      query.andWhere('assignment.type = :type', { type: TYPE_ASSIGNMENT.RANDOM });
    } else {
      query.andWhere('assignment.type = :type', { type });
    }
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`assignment.${sortBy}`, order);
    } else {
      query.orderBy(`assignment.createdAt`, order);
    }
    if (search) {
      query.andWhere('assignment.name ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(assignment.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(assignment.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(assignment.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(assignment.timeStart) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    };
  }
}