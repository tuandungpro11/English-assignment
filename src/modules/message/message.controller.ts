import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterMessageDto } from './dto/chat-query.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('Message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService
  ) {}

  @ApiOperation({
    summary: 'Lịch sử tin nhắn',
  })
  @Get('')
  async getHistoryChat(
    // @Query() filterMessage: FilterMessageDto, 
  ): Promise<any> {
    // return await this.messageService.testApi();
  }
}
