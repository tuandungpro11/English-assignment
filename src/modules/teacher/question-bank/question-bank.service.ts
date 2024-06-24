import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { AssignmentRepository, ClassRepository, QuestionBankRepository, QuestionRepository } from 'src/models/repositories';
import { AssignmentEntity, QuestionBankEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import _ from 'lodash'
import { isBefore } from 'date-fns';
import { CreateQuestionBankDto, QuestionDto } from '../question/dto/create-question.dto';
import { FilterQuestionDto } from '../question/dto/question-query.dto';
import { UpdateQuestionDto } from '../question/dto/update-question.dto';

@Injectable()
export class ManageQuestionBankService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly questionBankRepository: QuestionBankRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}

  async createQuestionInBank(createQuestion: CreateQuestionBankDto) {
    const { questions } = createQuestion;
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const insertBulkQuestion = _.map(questions, (question) => {
            return {
              ...question,
            }
          })
          await queryRunner.manager.insert(
            QuestionBankEntity,
            insertBulkQuestion
          );
          return "Thành công"
        }
      );
      return result;
    } catch (error) {
      console.log('create-question-error: ', error);
      throw new BadRequestException("Tạo câu hỏi thất bại")
    }
  }
  
  async getQuestionInBank(questionBankId: number): Promise<any> {
    const question = await this.questionBankRepository.getQuestionInBankById(questionBankId);
    return question;
  }
  
  async getListQuestionInBank(filterQuestion: FilterQuestionDto) {
    const assignments = await this.questionBankRepository.getListQuestionInBank(filterQuestion);
    return assignments;
  }
  
  async updateInformationQuestionInBank(questionBankId: number, updateQuestion: UpdateQuestionDto) {
    const question = await this.questionBankRepository.getQuestionInBankById(questionBankId);
    return await this.questionBankRepository.save({
      ...question,
      ...updateQuestion
    })
  }
  
  async deleteQuestionInBank(questionBankId: number) {
    const { affected } = await this.questionBankRepository.delete({ id: questionBankId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
}
