import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentEntity, NotificationEntity } from 'src/models/entities';
import { AssignmentSessionRepository, ClassStudentRepository, CommentRepository, NotificationRepository, StudentRepository } from 'src/models/repositories';
import { TeacherNotificationGateway } from 'src/modules/teacher/notification/teacher-notification.gateway';
import { TeacherNotificationService } from 'src/modules/teacher/notification/teacher-notification.service';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { AddCommentAssignmentDto } from './dto/add-comment-assignment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly studentRepository: StudentRepository,
    private readonly commentRepository: CommentRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly classStudentRepository: ClassStudentRepository,
    private readonly teacherNotificationGateway: TeacherNotificationGateway,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}
  async addComment(studentId: number, addCommentAssignment: AddCommentAssignmentDto) {
    const { assignmentSessionId, body } = addCommentAssignment;
    const assignmentSession = await this.assignmentSessionRepository.getSessionById(assignmentSessionId);
    const student = await this.studentRepository.getStudentById(studentId);
    if(assignmentSession.student.id !== student.id) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_ALLOW_COMMENT)
    }
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const newComment = new CommentEntity();
          newComment.body = body;
          newComment.student = student;
          newComment.assignmentSession = assignmentSession;
          
          const newNotification = new NotificationEntity();
          newNotification.body = `${student.name} đã bình luận vào bài tập ${assignmentSession.assignment.name}`;
          newNotification.student = student;
          newNotification.assignment = assignmentSession.assignment;
          
          await queryRunner.manager.save(newNotification);
          const comment = await queryRunner.manager.save(newComment);
          return comment;
        }
      );
      await this.teacherNotificationGateway.studentNotificationCommentAssignment();
      return result;
    } catch (error) {
      console.log('add-comment-error: ', error);
      throw new BadRequestException("Bình luận thất bại")
    }
  }
  
  async updateContentComment(studentId: number, commentId: number, updateComment: UpdateCommentDto) {
    const comment = await this.commentRepository.getCommentById(commentId);
    if(comment.student?.id !== studentId) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_ALLOW_COMMENT)
    }
    return await this.commentRepository.save({
      ...comment,
      ...updateComment
    })
  }
  
  async deleteComment(studentId: number, commentId: number) {
    const comment = await this.commentRepository.getCommentById(commentId);
    if(comment.student?.id !== studentId) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_ALLOW_COMMENT)
    }
    const { affected } = await this.commentRepository.delete({ id: commentId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
}
