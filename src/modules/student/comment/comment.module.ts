import { Module } from '@nestjs/common';
import { TeacherNotificationModule } from 'src/modules/teacher';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TeacherNotificationModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
