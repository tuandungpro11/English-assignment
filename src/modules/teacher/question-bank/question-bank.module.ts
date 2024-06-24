import { Module } from '@nestjs/common';
import { ManageQuestionBankController } from './question-bank.controller';
import { ManageQuestionBankService } from './question-bank.service';

@Module({
  controllers: [ManageQuestionBankController],
  providers: [ManageQuestionBankService],
})
export class ManageQuestionBankModule {}