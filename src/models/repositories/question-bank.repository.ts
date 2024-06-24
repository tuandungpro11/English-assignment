import { DataSource, IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QuestionBankEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import { FilterQuestionDto } from 'src/modules/teacher/question/dto/question-query.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { endOfDay, startOfDay } from 'date-fns';
import { TYPE_ASSIGNMENT } from 'src/shared/enums/type-assignment.enum';

@Injectable()
export class QuestionBankRepository extends Repository<QuestionBankEntity> {
  constructor(
    @InjectRepository(QuestionBankEntity)
    private readonly repository: Repository<QuestionBankEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  
  async getQuestionInBankById(id: number): Promise<QuestionBankEntity> {
    const questionInBank = await this.findOne({ where: { id } });
    if(!questionInBank) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return transformToPlain<QuestionBankEntity>(questionInBank);
  }
  
  async getListQuestionInBank(filterQuestion: FilterQuestionDto): Promise<PaginationResponse<QuestionBankEntity>> {
    const { page, limit, search, sortBy, sortOrder, startDate, endDate, createdAt } = filterQuestion;
    const query = this.createQueryBuilder('questionBank')
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortBy) {
      query.orderBy(`questionBank.${sortBy}`, order);
    } else {
      query.orderBy(`questionBank.createdAt`, order);
    }
    if (search) {
      query.andWhere('questionBank.body ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(questionBank.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(questionBank.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(questionBank.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(questionBank.timeStart) <= :endDate', {
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
    
  async getRandomQuestionByType(type: TYPE_ASSIGNMENT, count: number) {
    const query = this.createQueryBuilder('questionBank')
    if(type !== TYPE_ASSIGNMENT.RANDOM) {
      query.where('questionBank.type = :type', { type });
    }
    query.orderBy('RANDOM()').limit(count);
    const questionBank = await query.getMany();
    return transformToPlain<QuestionBankEntity[]>(questionBank)
  }
}
