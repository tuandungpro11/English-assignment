import { Module } from '@nestjs/common';
import { ManageQuestionController } from './teacher-question.controler';
import { ManageQuestionService } from './teacher-question.service';

@Module({
  controllers: [ManageQuestionController],
  providers: [ManageQuestionService],
})
export class ManageQuestionModule {}