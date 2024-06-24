import { Module } from '@nestjs/common';
import { TeacherNotificationModule } from '../notification/teacher-notification.module';
import { TeacherCommentController } from './teacher-comment.controller';
import { TeacherCommentService } from './teacher-comment.service';

@Module({
  imports: [TeacherNotificationModule],
  controllers: [TeacherCommentController],
  providers: [TeacherCommentService],
})
export class TeacherCommentModule {}
