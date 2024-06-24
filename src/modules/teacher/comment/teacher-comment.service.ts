import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentEntity, NotificationEntity } from 'src/models/entities';
import { AssignmentSessionRepository, CommentRepository, StudentRepository, TeacherRepository } from 'src/models/repositories';
import { AddCommentAssignmentDto } from 'src/modules/student/comment/dto/add-comment-assignment.dto';
import { UpdateCommentDto } from 'src/modules/student/comment/dto/update-comment.dto';
import { ERROR } from 'src/shared/exceptions';
import { BaseException } from 'src/shared/filters/exception.filter';
import { DatabaseUtilService } from 'src/shared/services/database-util.service';
import { DataSource } from 'typeorm';
import { TeacherNotificationGateway } from '../notification/teacher-notification.gateway';

@Injectable()
export class TeacherCommentService {
  constructor(
    private readonly assignmentSessionRepository: AssignmentSessionRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly commentRepository: CommentRepository,
    private readonly teacherNotificationGateway: TeacherNotificationGateway,
    private readonly databaseUtilService: DatabaseUtilService,
    private readonly dataSource: DataSource
  ) {}
  async addComment(teacherId: number, addCommentAssignment: AddCommentAssignmentDto) {
    const { assignmentSessionId, body } = addCommentAssignment;
    const assignmentSession = await this.assignmentSessionRepository.getSessionById(assignmentSessionId);
    const teacher = await this.teacherRepository.getTeacherById(teacherId);
    try {
      const result = await this.databaseUtilService.executeTransaction(
        this.dataSource,
        async (queryRunner) => {
          const newComment = new CommentEntity();
          newComment.body = body;
          newComment.teacher = teacher;
          newComment.assignmentSession = assignmentSession;
          
          const newNotification = new NotificationEntity();
          newNotification.body = `${teacher.name} đã bình luận vào bài tập ${assignmentSession.assignment.name}`;
          newNotification.student = assignmentSession.student;
          newNotification.teacher = teacher;
          newNotification.assignment = assignmentSession.assignment;
          
          await queryRunner.manager.save(newNotification);
          const comment = await queryRunner.manager.save(newComment);
          return comment;
        }
      );
      await this.teacherNotificationGateway.teacherNotificationCommentAssignment(assignmentSession.student.id);
      return result;
    } catch (error) {
      console.log('add-comment-error: ', error);
      throw new BadRequestException("Bình luận thất bại")
    }
    
  }
  
  async updateContentComment(teacherId: number, commentId: number, updateComment: UpdateCommentDto) {
    const comment = await this.commentRepository.getCommentById(commentId);
    if(comment.teacher?.id !== teacherId) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_ALLOW_COMMENT)
    }
    return await this.commentRepository.save({
      ...comment,
      ...updateComment
    })
  }
  
  async deleteComment(teacherId: number, commentId: number) {
    const comment = await this.commentRepository.getCommentById(commentId);
    if(comment.teacher?.id !== teacherId) {
      throw new BaseException(ERROR.ASSIGNMENT_NOT_ALLOW_COMMENT)
    }
    const { affected } = await this.commentRepository.delete({ id: commentId });
    if (affected <= 0) {
      throw new BaseException(ERROR.DELETE_FAILED);
    }
    return true;
  }
}
