import { Module } from '@nestjs/common';
import { ManageStudentService } from './teacher-student.service';
import { ManageStudentController } from './teacher-student.controller';
import { AssignmentModule } from 'src/modules/student';

@Module({
  imports: [AssignmentModule],
  controllers: [ManageStudentController],
  providers: [ManageStudentService],
})
export class ManageStudentModule {}