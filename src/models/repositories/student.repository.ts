import { Injectable } from "@nestjs/common";
import { StudentEntity } from "../entities/student.entity";
import { Brackets, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { transformToPlain } from "src/shared/transformers/class-to-plain.transformer";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { FilterStudentDto } from "src/modules/teacher/student/dto/student-query.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { endOfDay, startOfDay } from "date-fns";

@Injectable()
export class StudentRepository extends Repository<StudentEntity> {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repository: Repository<StudentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async isStudentExist(email: string): Promise <boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }
  
  async getStudentById(id: number): Promise <StudentEntity> {
    const student = await this.findOne({ where: { id } });
    if(!student) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<StudentEntity>(student);
  }
  
  async getListStudent(filterStudent: FilterStudentDto): Promise<PaginationResponse<StudentEntity>> {
    const { page, limit, search, sortBy, sortOrder } = filterStudent;
    const query = this.createQueryBuilder('student')
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`student.${sortBy}`, order);
    } else {
      query.orderBy(`student.createdAt`, order);
    }
    if (search) {
      query.andWhere(new Brackets(qb => {
        qb.where('student.name ILIKE :search', { search: `%${search}%` })
          .orWhere('student.email ILIKE :search', { search: `%${search}%` })
      }));
    }
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data: await transformToPlain<StudentEntity[]>(data),
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
}