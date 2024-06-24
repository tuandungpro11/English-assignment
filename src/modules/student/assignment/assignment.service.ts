import { Injectable } from '@nestjs/common';
import { AssignmentRepository, AssignmentSessionRepository, CommentRepository, QuestionRepository, StudentRepository } from 'src/models/repositories';
import { SaveAssignmentDto } from './dto/save-assignment.dto';
import { StartAssignmentDto } from './dto/start-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import _ from 'lodash';
import { addMinutes, isAfter, isBefore } from 'date-fns';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { AssignmentSessionEntity, QuestionEntity } from 'src/models/entities';
import { StatusAssignmentSession } from 'src/shared/enums/status.enum';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { isParse } from 'src/shared/utils/utils';
import { MapStudentAnswerDto } from './dto/student-answer.dto';
import { QueryAssignmentDto, QueryQuestionDto } from './dto/query-assignment.dto';
import { EditAnswerDto } from './dto/edit-answer.dto';

@Injectable()
export class AssignmentService {
  private redisInstance: Redis;
  
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly commentRepository: CommentRepository,
    private readonly redisService: RedisService,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }
  
  async countCompleted(studentId: number, classId: number) {
    const assignments = await this.assignmentRepository.find({
      where: {
        class: {
          id: classId
        }
      }
    })
    const assignmentIds = _.map(assignments, 'id');
    const assignmentSessions = await this.assignmentSessionRepository.getListCompletedSession(studentId, assignmentIds);
    return {
      countCompleted: assignmentSessions.length,
      countTotal: assignments.length
    }
  }
  
  async getRankAssignment(queryAssignment: QueryAssignmentDto) {
    const assignmentSessions = await this.assignmentSessionRepository.getListSessionByAssignment(queryAssignment);
    return _.map(assignmentSessions, (assignmentSession) => {
      return _.omit(assignmentSession, ['studentAnswer', 'status', 'student'])
    });
  }
  
  async getQuestion(studentId: number, queryQuestion: QueryQuestionDto) {
    const { assignmentId, questionId } = queryQuestion;
    const assignmentStudent = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, assignmentId);
    if(!assignmentStudent) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    const result = await this.handleResultQuestion(assignmentStudent, questionId);
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
    const checkAnswer = this.checkCorrectAnswer(Number(question.type), question.response, JSON.stringify(answers[questionId]));
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
  
  async start(studentId: number, startAssignment: StartAssignmentDto) {
    const { assignmentId } = startAssignment;
    const assignmentStudent = await this.assignmentSessionRepository.getAssignmentCompleted(studentId, assignmentId);
    if(assignmentStudent) {
      const comments = await this.commentRepository.getListCommentByAssignment(assignmentStudent.id);
      const result = await this.handleResultAssignment(assignmentStudent);
      return {
        ...result,
        comments: _.map(comments, comment => _.omit(comment, ['assignmentSession']))
      }
    }
    
    let session = await this.session(studentId, assignmentId);
    
    if(isBefore(session.assignment.timeEnd, new Date())) {
      session.timeStart = session.assignment.timeEnd;
      session.timeEnd = session.assignment.timeEnd;
      session.invalidAt = session.assignment.timeEnd;
      session.status = StatusAssignmentSession.COMPLETED;
      await this.assignmentSessionRepository.save(session);
      throw new BaseException(ERROR.ASSIGNMENT_END);
    }
    
    if(_.isNull(session.timeStart)) {
      session.timeStart = new Date();
    }
    
    let questions = await this.questionRepository.getQuestionsByAssignmentId(assignmentId);
    
    session.invalidAt = this.calculateTimeInvalid(session.timeStart, session.assignment.timeAllow);
    session = await this.assignmentSessionRepository.save(session);
    const studentAnswers = await this.redisInstance.hgetall(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${session.id}`);
    if(!_.isEmpty(studentAnswers)) {
      questions = _.map(questions, question => {
        return { ...question, answer: studentAnswers[question.id] || null}
      })
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
      const { mark, mapStudentAnswers } = await this.handleStudentAnswers(questions, assignmentSession.assignment.totalMark, studentAnswers);
      const serialized = JSON.stringify(Array.from(mapStudentAnswers));
      assignmentSession.status = StatusAssignmentSession.COMPLETED;
      assignmentSession.studentAnswer = serialized;
      assignmentSession.answerCount = mapStudentAnswers.size;
      const updatedAssignmentSession = await this.assignmentSessionRepository.save({
        ...assignmentSession,
        mark,
      })
      
      await this.redisInstance.del(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${assignmentSessionId}`);
      const result = await this.handleResultAssignment(updatedAssignmentSession);
      return result;
    } catch (error) {
      console.log('submit-error: ', error);
      return error.message || "Thất bại"
    }
  }
  
  async session(studentId: number, assignmentId: number) {
    const student = await this.studentRepository.getStudentById(studentId);
    const assignment = await this.assignmentRepository.getAssignmentById(assignmentId);
    
    if(isBefore(assignment.timeEnd, new Date())) {
      throw new BaseException(ERROR.ASSIGNMENT_END);
    }
    if(isAfter(assignment.timeStart, new Date())) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_START);
    }
    
    let assignmentSession = await this.assignmentSessionRepository.getSessionAllStatus(studentId, assignmentId);
    if(!assignmentSession) {
      const newAssignmentSession = new AssignmentSessionEntity();
      newAssignmentSession.student = student;
      newAssignmentSession.assignment = assignment;
      newAssignmentSession.status = StatusAssignmentSession.IN_PROGRESS;
      assignmentSession = await this.assignmentSessionRepository.save(newAssignmentSession);
    }
    if(assignmentSession.status === StatusAssignmentSession.COMPLETED) {
      throw new BaseException(ERROR.ASSIGNMENT_END);
    }
    return transformToPlain<AssignmentSessionEntity>(assignmentSession);
  }
  
  calculateTimeInvalid(timeStart: Date, timeAllow: number) {
    const resultDateTime = addMinutes(timeStart, timeAllow);
    return resultDateTime;
  }
  
  async handleStudentAnswers(questions: QuestionEntity[], maxMark: number, answers: Record<string, string>) {
    const studentAnswers = answers;
    let correct = 0;
    const mapStudentAnswers = new Map();
    _.forEach(studentAnswers, (value, key) => {
      const correctAnswer = _.find(questions, { id: Number(key) });
      if(!_.isNil(correctAnswer)) {
        const isCorrect = this.checkCorrectAnswer(Number(correctAnswer.type), correctAnswer.response, value);
        mapStudentAnswers.set(correctAnswer.id, { answer: value, isCorrect })
        if (isCorrect) {
          correct++;
        }
      }
    })
    const mark = (correct / questions.length) * maxMark;
    return { mark, mapStudentAnswers };
  }
  
  checkCorrectAnswer(type: number, correctAnswer: string, answer: string): boolean {
    const parseAnswer = isParse(answer) ? JSON.parse(answer) : null;
    const parseCorrectAnswer = isParse(correctAnswer) ? JSON.parse(correctAnswer) : null;
    if(!parseAnswer || !parseCorrectAnswer) {
      return false;
    }
    if (type === 3) {
      return _.every(parseCorrectAnswer, (value, index) => {
        const arrAnswers = value.map(String);
        return _.includes(arrAnswers, parseAnswer[index]);
      })
    } else if (type === 1) {
      return parseAnswer.length === 1 && _.isEqual(Number(parseAnswer[0]), Number(parseCorrectAnswer));
    } else if (type === 2 || type === 4) {
      const arrCorrectAnswers = Object.values(parseCorrectAnswer);
      const arrAnswers = parseAnswer.map(Number);
      const difference = _.difference(arrCorrectAnswers, arrAnswers);
      if (arrCorrectAnswers.length === arrAnswers.length && _.isEmpty(difference)) {
        return true
      } else {
        return false
      }
    } else {
      return _.isEqual(parseAnswer, parseCorrectAnswer);
    }
  }
  
  async finishSession() {
    const assignmentSessions = await this.assignmentSessionRepository.getListSessionsUnfinished();
    for (const session of assignmentSessions) {
      const studentAnswers = await this.redisInstance.hgetall(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${session.id}`);
      let questions = await this.questionRepository.getListCorrectAnswer(session.assignment.id);
      questions = _.filter(questions, question => question.isParent === false);
      const { mark, mapStudentAnswers } = await this.handleStudentAnswers(questions, session.assignment.totalMark, studentAnswers);
      const serialized = JSON.stringify(Array.from(mapStudentAnswers));
      session.status = StatusAssignmentSession.COMPLETED;
      session.studentAnswer = serialized;
      await this.redisInstance.del(`${CACHE_CONSTANT.ASSIGNMENT_PREFIX}${session.id}`);
      await this.assignmentSessionRepository.save({
        ...session,
        status: StatusAssignmentSession.COMPLETED,
        answerCount: mapStudentAnswers.size,
        timeEnd: session.invalidAt >= session.assignment.timeEnd ? session.assignment.timeEnd : session.invalidAt,
        mark,
      })
    }
  }
  
  async handleResultAssignment(assignmentSession: AssignmentSessionEntity) {
    const reverse = isParse(assignmentSession.studentAnswer) ? JSON.parse(assignmentSession.studentAnswer) : [];
    const studentAnswer = new Map(reverse);
    let questions = await this.questionRepository.getListCorrectAnswer(assignmentSession.assignment.id);
    let data: Partial<AssignmentSessionEntity> = assignmentSession;
    questions = _.map(questions, question => {
      if(question.isParent) {
        return question;
      }
      const value =  studentAnswer.get(question.id) as MapStudentAnswerDto;
      return { ...question, answer: value ? value.answer : null, isCorrect: value ? value.isCorrect : false }
    })
    let grouped = _.groupBy(questions, 'parentId');
    questions = _.map(questions, question => {
      if (question.isParent) {
        return {
          ...question,
          childQuestions: grouped[question.id] || []
        };
      }
      return question;
    });
    
    // Lọc ra chỉ những câu hỏi không có parentId (câu hỏi cha và câu hỏi không thuộc câu hỏi nào)
    questions = _.filter(questions, question => question.parentId === null);
    return {
      response: _.omit(data, ['studentAnswer', 'status', 'student']),
      questions
    };
  }
  
  async handleResultQuestion(assignmentSession: AssignmentSessionEntity, questionId: number) {
    const reverse = isParse(assignmentSession.studentAnswer) ? JSON.parse(assignmentSession.studentAnswer) : [];
    const studentAnswer = new Map(reverse);
    let questions = await this.questionRepository.getListCorrectAnswer(assignmentSession.assignment.id);
    let data: Partial<AssignmentSessionEntity> = assignmentSession;
    questions = _.map(questions, question => {
      if(question.isParent) {
        return question;
      }
      const value =  studentAnswer.get(question.id) as MapStudentAnswerDto;
      return { ...question, answer: value ? value.answer : null, isCorrect: value ? value.isCorrect : false }
    })
    let grouped = _.groupBy(questions, 'parentId');
    questions = _.map(questions, question => {
      if (question.isParent) {
        return {
          ...question,
          childQuestions: grouped[question.id] || []
        };
      }
      return question;
    });
    
    // Lọc ra chỉ những câu hỏi không có parentId (câu hỏi cha và câu hỏi không thuộc câu hỏi nào)
    questions = _.filter(questions, question => question.parentId === null && question.id === questionId);
    return {
      questions
    };
  }
}
