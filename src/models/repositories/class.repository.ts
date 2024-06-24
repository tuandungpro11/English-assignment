import { Injectable } from "@nestjs/common";
import { StudentEntity } from "../entities/student.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { ClassEntity } from "../entities";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { FilterClassDto } from "src/modules/teacher/class/dto/class-query.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { endOfDay, startOfDay } from "date-fns";

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly repository: Repository<ClassEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async isClassNameExist(name: string): Promise<boolean> {
    const count = await this.count({ where: { name } });
    return count > 0;
  }
  
  async getClassById(classId: number): Promise<ClassEntity> {
    const classEntity = await this.repository.findOne({
      where: { id: classId },
    })
    if (!classEntity) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return classEntity;
  }
  
  async getListClasses(filterClass: FilterClassDto): Promise<PaginationResponse<ClassEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt, startDate, endDate } = filterClass;
    const query = this.createQueryBuilder('class');
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`class.${sortBy}`, order);
    } else {
      query.orderBy(`class.createdAt`, order);
    }
    if (search) {
      query.andWhere('class.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(class.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(class.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(class.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(class.createdAt) <= :endDate', {
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
    }
  }
  
  async getListClassesByStudent(studentId: number, filterClass: FilterClassDto): Promise<PaginationResponse<ClassEntity>> {
    const { page, limit, search, sortBy, sortOrder, createdAt, startDate, endDate } = filterClass;
    const query = this.createQueryBuilder('class');
    query.innerJoin('class.classStudent', 'classStudent');
    query.andWhere('classStudent.student = :studentId', { studentId });
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`class.${sortBy}`, order);
    } else {
      query.orderBy(`class.createdAt`, order);
    }
    if (search) {
      query.andWhere('class.name LIKE :search', { search: `%${search}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(class.createdAt) = :createdAt', { createdAt });
    }

    if (startDate && endDate) {
      query.andWhere('DATE(class.createdAt) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(class.createdAt) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(class.createdAt) <= :endDate', {
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
    }
  }
}