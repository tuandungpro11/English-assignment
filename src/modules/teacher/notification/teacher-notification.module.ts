import { Module } from '@nestjs/common';
import { TeacherNotificationController } from './teacher-notification.controller';
import { TeacherNotificationGateway } from './teacher-notification.gateway';
import { TeacherNotificationService } from './teacher-notification.service';

@Module({
  // controllers: [TeacherNotificationController],
  providers: [TeacherNotificationGateway, TeacherNotificationService],
  exports: [TeacherNotificationService, TeacherNotificationGateway],
})
export class TeacherNotificationModule {}
