import { Module } from '@nestjs/common';
import { StudentAccountService } from './account.service';
import { StudentAccountController } from './account.controller';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { MessageModule } from 'src/modules/message/message.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [MessageModule],
  controllers: [StudentAccountController],
  providers: [StudentAccountService, UploadLocalService],
})
export class StudentAccountModule {}