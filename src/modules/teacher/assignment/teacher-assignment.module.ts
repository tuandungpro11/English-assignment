import { Module } from '@nestjs/common';
import { ManageAssignmentController } from './teacher-assignment.controller';
import { ManageAssignmentService } from './teacher-assignment.service';

@Module({
  controllers: [ManageAssignmentController],
  providers: [ManageAssignmentService],
})
export class ManageAssignmentModule {}