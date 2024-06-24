import { Module } from '@nestjs/common';
import { ManageClassController } from './teacher-class.controller';
import { ManageClassService } from './teacher-class.service';

@Module({
  controllers: [ManageClassController],
  providers: [ManageClassService],
})
export class ManageClassModule {}