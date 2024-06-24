import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignmentRepository, AssignmentSessionRepository, CommentRepository, QuestionBankRepository, QuestionRepository, StudentRepository } from 'src/models/repositories';
import _ from 'lodash';
import { addHours, format, getTime } from 'date-fns'
import { vi } from 'date-fns/locale'
import { addMinutes, isAfter, isBefore } from 'date-fns';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { AssignmentEntity, AssignmentSessionEntity, QuestionEntity } from 'src/models/entities';
import { StatusAssignmentSession } from 'src/shared/enums/status.enum';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { isParse } from 'src/shared/utils/utils';
import { QueryQuestionDto } from '../assignment/dto/query-assignment.dto';
import { EditAnswerDto } from '../assignment/dto/edit-answer.dto';
import { AssignmentService } from '../assignment/assignment.service';
import { SaveAssignmentDto } from '../assignment/dto/save-assignment.dto';
import { SubmitAssignmentDto } from '../assignment/dto/submit-assignment.dto';
import { StartPracticeRoomDto } from './dto/start-practice-room.dto';
import { StartAssignmentDto } from '../assignment/dto/start-assignment.dto';
import { TYPE_ASSIGNMENT } from 'src/shared/enums/type-assignment.enum';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { FilterPracticeRoomDto } from './dto/practice-room-query.dto';

@Injectable()
export class PracticeRoomService {
  private redisInstance: Redis;
  
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentService: AssignmentService,
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly questionBankRepository: QuestionBankRepository,
    private readonly redisService: RedisService,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }
  
  async getAssignmentPracticeRoom(studentId: number, filterPracticeRoom: FilterPracticeRoomDto) {
    const assignments = await this.assignmentRepository.getListAssignmentByPracticeRoom(studentId, filterPracticeRoom);
    if(assignments.length > 0) {
      const assignmentCompleted = await this.assignmentSessionRepository.getListCompletedSession(studentId, _.map(assignments, 'id'));
      const result = _.map(assignments, (assignment) => {
        const assignmentSession = _.find(assignmentCompleted, { id: assignment.id });
        if(assignmentSession) {
          return {
            ...assignment,
            status: false
          }
        } else {
          return {
            ...assignment,
            status: true
          } 
        }
      })
      return result;
    }
    return assignments;
  }
  
  async getQuestion(studentId: number, queryQuestion: QueryQuestionDto) {
    const { assignmentId, questionId } = queryQuestion;
    const assignmentStudent = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, assignmentId);
    if(!assignmentStudent) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    const result = await this.assignmentService.handleResultQuestion(assignmentStudent, questionId);
    return result;
  }
  
  async updateAnswerQuestion(studentId: number, editAnswer: EditAnswerDto) {
    const { assignmentId, questionId, answers } = editAnswer;
    const assignmentStudent = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, assignmentId);
    if(!assignmentStudent) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    if(!answers[questionId]) {
      throw new BaseException(ERROR.INVALID_PARAMS);
    }
    const reverse = isParse(assignmentStudent.studentAnswer) ? JSON.parse(assignmentStudent.studentAnswer) : [];
    const studentAnswer = new Map(reverse);
    
    const checkCorrect = studentAnswer.get(questionId)['isCorrect'];
    if(checkCorrect) {
      throw new BaseException(ERROR.ANSWER_CORRECT);
    }
    
    const question = await this.questionRepository.getQuestionWithResponse(questionId);
    const checkAnswer = this.assignmentService.checkCorrectAnswer(Number(question.type), question.response, JSON.stringify(answers[questionId]));
    studentAnswer.set(questionId, { answer: JSON.stringify(answers[questionId]), isCorrect: checkAnswer });
    
    const serialized = JSON.stringify(Array.from(studentAnswer));
    let mark = Number(assignmentStudent.mark);
    if(checkAnswer) {
      const markEachQuestion = assignmentStudent.assignment.totalMark / assignmentStudent.assignment.questionCount;
      const countCorrect =  Math.round(assignmentStudent.mark / markEachQuestion) + 1;
      mark = countCorrect * markEachQuestion;
      await this.assignmentSessionRepository.save({
        ...assignmentStudent,
        mark,
        studentAnswer: serialized
      })
    } else {
      await this.assignmentSessionRepository.save({
        ...assignmentStudent,
        studentAnswer: serialized
      })
    }
    return {
      answer: JSON.stringify(answers[questionId]),
      isCorrect: checkAnswer,
      mark
    }
  }
  
  async start(studentId: number, startPracticeRoom: StartPracticeRoomDto) {
    let questions = [];
    let session: AssignmentSessionEntity = null;
    if(startPracticeRoom.assignmentId) {
      const assignmentStudent = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, startPracticeRoom.assignmentId);
      if(assignmentStudent) {
        const result = await this.assignmentService.handleResultAssignment(assignmentStudent);
        return {
          ...result,
        }
      }
      const assignment = await this.assignmentRepository.getAssignmentById(startPracticeRoom.assignmentId);
      
      if(isBefore(assignment.timeEnd, new Date())) {
        throw new BaseException(ERROR.ASSIGNMENT_END);
      }
      if(isAfter(assignment.timeStart, new Date())) {
        throw new BaseException(ERROR.ASSIGNMENT_NOT_START);
      }
      
      session = await this.assignmentSessionRepository.getSessionAllStatus(studentId, assignment.id);
      
      if(session.status === StatusAssignmentSession.COMPLETED) {
        throw new BaseException(ERROR.ASSIGNMENT_END);
      }
      
      if(isBefore(session.assignment.timeEnd, new Date())) {
        session.timeStart = session.assignment.timeEnd;
        session.timeEnd = session.assignment.timeEnd;
        session.invalidAt = session.assignment.timeEnd;
        session.status = StatusAssignmentSession.COMPLETED;
        await this.assignmentSessionRepository.save(session);
        throw new BaseException(ERROR.ASSIGNMENT_END);
      }
      questions = await this.questionRepository.getQuestionsByAssignmentId(assignment.id);
      
      const studentAnswers = await this.redisInstance.hgetall(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${session.id}`);
      if(!_.isEmpty(studentAnswers)) {
        questions = _.map(questions, question => {
          return { ...question, answer: studentAnswers[question.id] || null}
        })
      }
    } else {
      const newAssignment = new AssignmentEntity();
      newAssignment.name = `Luyện tập: ${format(addHours(new Date(), 7), 'dd MMM yyyy p', { locale: vi })}`;
      newAssignment.timeAllow = startPracticeRoom.timeAllow;
      newAssignment.type = startPracticeRoom.type;
      newAssignment.timeStart = new Date();
      newAssignment.timeEnd = addMinutes(newAssignment.timeStart, newAssignment.timeAllow);
      newAssignment.totalMark = 100;
      newAssignment.questionCount = startPracticeRoom.questionCount;
      const assignment = await this.assignmentRepository.save(newAssignment);
      
      const student = await this.studentRepository.getStudentById(studentId);
      questions = await this.randomQuestionForAssignment(assignment, startPracticeRoom.type, startPracticeRoom.questionCount);
      await this.assignmentRepository.update({ id: assignment.id }, { questionCount: questions.length });
      const newAssignmentSession = new AssignmentSessionEntity();
      newAssignmentSession.student = student;
      newAssignmentSession.assignment = assignment;
      newAssignmentSession.status = StatusAssignmentSession.IN_PROGRESS;
      const assignmentSession = await this.assignmentSessionRepository.save(newAssignmentSession);
      
      if(_.isNull(assignmentSession.timeStart)) {
        assignmentSession.timeStart = new Date();
      }
      
      assignmentSession.invalidAt = this.assignmentService.calculateTimeInvalid(assignmentSession.timeStart, assignmentSession.assignment.timeAllow);
      session = await this.assignmentSessionRepository.save(assignmentSession);
    }
    let grouped = _.groupBy(questions, 'parentId');
    questions = _.map(questions, question => {
      if(question.isParent) {
        return {
          ...question,
          childQuestions: grouped[question.id] || []
        }
      }
      return question;
    })
    
    // Lọc ra chỉ những câu hỏi không có parentId (câu hỏi cha và câu hỏi không thuộc câu hỏi nào)
    questions = _.filter(questions, question => question.parentId === null);
    
    return {
      session: {
        ..._.pick(session, ['id', 'timeStart', 'invalidAt']),
        assignment: session.assignment
      },
      questions
    }
  }
  
  async save(studentId: number, saveAssignment: SaveAssignmentDto) {
    const { assignmentSessionId, answers } = saveAssignment;
    const session = await this.assignmentSessionRepository.findOne({
      where: { id: assignmentSessionId, student: { id: studentId }, status: StatusAssignmentSession.IN_PROGRESS}
    });
    if(!session) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    if(isBefore(session.invalidAt, new Date())) {
      throw new BaseException(ERROR.ASSIGNMENT_END);
    }
    try {
      const studentAnswers = _.mapValues(answers, value => JSON.stringify(value));
      await this.redisInstance.hmset(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${assignmentSessionId}`, studentAnswers);
      return true;
    } catch (error) {
      console.log('save assignment error: ', error);
      return false;
    }
  }
  async submit(studentId: number, submitAssignment: SubmitAssignmentDto) {
    const { assignmentSessionId, answers } = submitAssignment;
    try {
      const assignmentSession = await this.assignmentSessionRepository.findOne({
        where: { 
          id: assignmentSessionId,
          student: { id: studentId },
          status: StatusAssignmentSession.IN_PROGRESS 
        }
      });
      if(!assignmentSession) {
        throw new BaseException(ERROR.NOT_FOUND);
      }
      if(isBefore(assignmentSession.invalidAt, new Date())) {
        throw new BaseException(ERROR.ASSIGNMENT_END);
      }
      const timeSubmit = new Date();
      assignmentSession.timeEnd = assignmentSession.invalidAt >= timeSubmit ? timeSubmit : assignmentSession.invalidAt;
      await this.assignmentSessionRepository.save(assignmentSession);
      if(!_.isEmpty(answers)) {
        const stringifyAnswers = _.mapValues(answers, value => JSON.stringify(value));
        await this.redisInstance.hmset(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${assignmentSessionId}`, stringifyAnswers);
      }
      const studentAnswers = await this.redisInstance.hgetall(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${assignmentSessionId}`);
      let questions = await this.questionRepository.getListCorrectAnswer(assignmentSession.assignment.id);
      questions = _.filter(questions, question => question.isParent === false);
      const { mark, mapStudentAnswers } = await this.assignmentService.handleStudentAnswers(questions, assignmentSession.assignment.totalMark, studentAnswers);
      const serialized = JSON.stringify(Array.from(mapStudentAnswers));
      assignmentSession.status = StatusAssignmentSession.COMPLETED;
      assignmentSession.studentAnswer = serialized;
      assignmentSession.answerCount = mapStudentAnswers.size;
      const updatedAssignmentSession = await this.assignmentSessionRepository.save({
        ...assignmentSession,
        mark,
      })
      
      await this.redisInstance.del(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${assignmentSessionId}`);
      const result = await this.assignmentService.handleResultAssignment(updatedAssignmentSession);
      return result;
    } catch (error) {
      console.log('submit-error: ', error);
      return error.message || "Thất bại"
    }
  }
  
  async randomQuestionForAssignment(assignment: AssignmentEntity, type: TYPE_ASSIGNMENT, count: number) {
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const questions = await this.questionBankRepository.getRandomQuestionByType(type, count);
          const insertBulkQuestion = _.map(questions, (question) => {
            return {
              ...question,
              assignment
            }
          })
          return await queryRunner.manager.insert(
            QuestionEntity,
            insertBulkQuestion
          );
        }
      );
      const questionIds =  _.map(result.identifiers, 'id');
      return await this.questionRepository.getQuestionsByIds(questionIds);
    } catch (error) {
      console.log('insert question practice room: ', error);
      throw new BadRequestException('Thất bại');
    }
  }
}
