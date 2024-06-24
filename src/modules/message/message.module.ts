import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  // controllers: [MessageController],
  providers: [MessageGateway, MessageService],
  exports: [MessageService]
})
export class MessageModule {}
