import { Injectable } from "@nestjs/common";
import { StudentEntity } from "../entities/student.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { QuestionEntity } from "../entities";
import { transformToPlain } from "src/shared/transformers/class-to-plain.transformer";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";
import { FilterQuestionDto } from "src/modules/teacher/question/dto/question-query.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { endOfDay, startOfDay } from "date-fns";
import _ from 'lodash';
import { TYPE_ASSIGNMENT } from "src/shared/enums/type-assignment.enum";

@Injectable()
export class QuestionRepository extends Repository<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly repository: Repository<QuestionEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getQuestionById(id: number): Promise<QuestionEntity> {
    const question = await this.findOne({ 
      where: { id },
      relations: ['assignment'] 
    });
    if(!question) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return transformToPlain<QuestionEntity>(question);
  }
  
  async getQuestionWithResponse(questionId: number) {
    const question = await this.createQueryBuilder('question')
      .where('question.id = :questionId', { questionId })
      .addSelect('question.response')
      .addSelect('question.instruction')
      .getOne()
    return transformToPlain<QuestionEntity>(question)
  }
  
  async getQuestionsByAssignmentId(assignmentId: number): Promise <QuestionEntity[]> {
    const questions = await this.repository.find({ 
      where: { assignment: { id: assignmentId } },
      order: { id: 'ASC' }
    });
    return transformToPlain<QuestionEntity[]>(questions);
  }
  
  async getQuestionsByIds(ids: number[]): Promise <QuestionEntity[]> {
    const questions = await this.repository.find({ 
      where: { id: In(ids) },
      order: { id: 'ASC' }
    });
    return transformToPlain<QuestionEntity[]>(questions);
  }
  
  async getListCorrectAnswer(assignmentId: number) {
    const questions = await this.createQueryBuilder('question')
      .where('question.assignment = :assignmentId', { assignmentId })
      .addSelect('question.response')
      .addSelect('question.instruction')
      .getMany()
    return transformToPlain<QuestionEntity[]>(questions)
  }
  
  async getListQuestionByAssignment(assignmentId: number, filterQuestion: FilterQuestionDto): Promise<PaginationResponse<QuestionEntity>> {
    const { page, limit, search, sortBy, sortOrder, startDate, endDate, createdAt } = filterQuestion;
    const query = this.createQueryBuilder('question')
    query.andWhere('question.assignment = :assignmentId', { assignmentId });
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    query.addSelect('question.response');
    query.addSelect('question.instruction');
    if (sortBy) {
      query.orderBy(`question.${sortBy}`, order);
    } else {
      query.orderBy(`question.createdAt`, order);
    }
    if (search) {
      query.andWhere('question.body ILIKE :search', { search: `%${search}%` })
    }
    
    if (createdAt) {
      query.andWhere('DATE(question.createdAt) = :createdAt', { createdAt });
    }
    
    if (startDate && endDate) {
      query.andWhere('DATE(question.timeStart) BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(new Date(startDate)),
        endDate: endOfDay(new Date(endDate)),
      });
    } else if(startDate) {
      query.andWhere('DATE(question.timeStart) >= :startDate', {
        startDate: startOfDay(new Date(startDate)),
      });
    } else if(endDate) {
      query.andWhere('DATE(question.timeStart) <= :endDate', {
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