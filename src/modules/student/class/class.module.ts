import { Module } from '@nestjs/common';
import { AssignmentModule } from '../assignment/assignment.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  imports: [AssignmentModule],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
