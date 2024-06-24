import { Module } from '@nestjs/common';

import { AuthStudentController } from './auth-student.controller';
import { AuthStudentService } from './auth-student.service';

@Module({
  controllers: [AuthStudentController],
  providers: [AuthStudentService],
})
export class AuthStudentModule {}
