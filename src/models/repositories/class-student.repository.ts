import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { ClassStudentEntity } from "../entities";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { transformToPlain } from "src/shared/transformers/class-to-plain.transformer";
import _ from "lodash";
import { FilterClassStudentDto } from "src/modules/teacher/class/dto/class-query.dto";
import { endOfDay, startOfDay } from "date-fns";

@Injectable()
export class ClassStudentRepository extends Repository<ClassStudentEntity> {
  constructor(
    @InjectRepository(ClassStudentEntity)
    private readonly repository: Repository<ClassStudentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async isClassParticipant(studentId: number, classId: number): Promise<boolean> {
    const count = await this.count({ 
      where: { 
        student: { id: studentId },
        class: { id: classId },
      }
    });
    return count > 0;
  }
  
  async getListStudentFromClass(filterClassStudentDto: FilterClassStudentDto): Promise<any> {
    const { classId, search, createdAt, startDate, endDate, page, limit, sortBy, sortOrder } = filterClassStudentDto;
    const query = this.createQueryBuilder('classStudent');
    query.innerJoinAndSelect('classStudent.student', 'student');
    query.andWhere('classStudent.class = :classId', { classId });
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`classStudent.${sortBy}`, order);
    } else {
      query.orderBy(`classStudent.createdAt`, order);
    }
    if (search) {
      query.andWhere('student.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(classStudent.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(classStudent.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(classStudent.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(classStudent.createdAt) <= :endDate', {
        endDate: endOfDay(new Date(endDate)),
      });
    }
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [classStudents, total] = await query.getManyAndCount();
    
    let data = [];
    
    if(classStudents.length > 0) {
      data = _.map(classStudents, (classStudent) => {
        return classStudent.student;
      })
    }
    
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
    
    // const classStudents = await this.repository.find({ 
    //   where: { 
    //     class: { id: classId },
    //   }
    // });
    if(classStudents.length > 0) {
      const students = _.map(classStudents, (classStudent) => {
        return classStudent.student;
      })
      return students;
    }
    return [];
  }
  
  async getListClassIdsFromStudent(studentId: number): Promise<any> {
    const classStudents = await this.repository.find({ 
      where: { 
        student: { id: studentId },
      }
    });
    if(classStudents.length > 0) {
      const classes = _.map(classStudents, (classStudent) => {
        return classStudent.class.id;
      })
      return classes;
    }
    return [];
  }
}