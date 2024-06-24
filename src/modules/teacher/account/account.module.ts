import { Module } from '@nestjs/common';
import { TeacherAccountService } from './account.service';
import { TeacherAccountController } from './account.controller';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { MessageModule } from 'src/modules/message/message.module';

@Module({
  imports: [MessageModule],
  controllers: [TeacherAccountController],
  providers: [TeacherAccountService, UploadLocalService],
})
export class TeacherAccountModule {}