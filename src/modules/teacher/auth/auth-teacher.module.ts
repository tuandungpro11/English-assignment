import { Module } from '@nestjs/common';

import { AuthTeacherController } from './auth-teacher.controller';
import { AuthTeacherService } from './auth-teacher.service';

@Module({
  controllers: [AuthTeacherController],
  providers: [AuthTeacherService],
})
export class AuthTeacherModule {}
