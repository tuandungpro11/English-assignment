import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { AssignmentRepository, ClassRepository, QuestionRepository } from 'src/models/repositories';
import { AssignmentEntity, QuestionEntity } from 'src/models/entities';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import _ from 'lodash'
import { isBefore } from 'date-fns';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuestionDto } from './dto/question-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class ManageQuestionService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}

  async createQuestion(createQuestion: CreateQuestionDto) {
    const { assignmentId, questions } = createQuestion;
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const assignmentRepository = queryRunner.manager.getRepository(AssignmentEntity);
          const insertBulkQuestion = _.map(questions, (question) => {
            return {
              ...question,
              assignment
            }
          })
          await queryRunner.manager.insert(
            QuestionEntity,
            insertBulkQuestion
          );
          await assignmentRepository.update({ id: assignmentId }, { questionCount: insertBulkQuestion.length })
          return "Thành công"
        }
      );
      return result;
    } catch (error) {
      console.log('create-question-error: ', error);
      throw new BadRequestException("Tạo câu hỏi thất bại")
    }
  }
  
  async getQuestion(questionId: number): Promise<any> {
    const question = await this.questionRepository.getQuestionById(questionId);
    return question;
  }
  
  async getListQuestion(assignmentId: number, filterQuestion: FilterQuestionDto) {
    const assignments = await this.questionRepository.getListQuestionByAssignment(assignmentId, filterQuestion);
    return assignments;
  }
  
  async updateInformationQuestion(questionId: number, updateQuestion: UpdateQuestionDto) {
    const question = await this.questionRepository.getQuestionById(questionId);
    return await this.questionRepository.save({
      ...question,
      ...updateQuestion
    })
  }
  
  async deleteQuestion(questionId: number) {
    const question = await this.questionRepository.getQuestionById(questionId);
    await this.assignmentRepository.update({ id: question.assignment.id }, { questionCount: question.assignment.questionCount - 1 });
    const { affected } = await this.questionRepository.delete({ id: questionId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
}
