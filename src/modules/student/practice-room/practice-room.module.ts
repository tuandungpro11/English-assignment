import { Module } from '@nestjs/common';
import { AssignmentModule } from '../assignment/assignment.module';
import { PracticeRoomController } from './practice-room.controller';
import { PracticeRoomService } from './practice-room.service';


@Module({
  imports: [AssignmentModule],
  controllers: [PracticeRoomController],
  providers: [PracticeRoomService],
})
export class PracticeRoomModule {}
