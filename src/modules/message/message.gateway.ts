import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { Redis } from 'ioredis';

import { AuthenticatedWsGuard } from '../../shared/guards/authenticated-ws.guard';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { DirectMessageDto } from './dto/direct-message.dto';
import { MessageService } from './message.service';
import { ReadMessageDto } from './dto/read-message.dto';
import { ConversationRepository } from 'src/models/repositories';
import _ from 'lodash';
import { GetMessageDto } from './dto/get-message.dto';

@UseGuards(AuthenticatedWsGuard)
@WebSocketGateway(
  { 
    cors: { origin: true },
  }
)
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private redisInstance: Redis;
  
  constructor(
    private readonly redisService: RedisService,
    private readonly messageService: MessageService,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessageGateway');

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const clientId = client.id.toString();
    const studentId = client.handshake.auth?.studentId;
    const teacherId = client.handshake.auth?.teacherId;
    if (!studentId && !teacherId) {
      return this.disconnect(client);
    }
    this.logger.log(`Message: User connected ${clientId}`);
    if(studentId) {
      client.join(`Student:${studentId}`);
      await this.redisInstance.hsetnx(
        `${CACHE_CONSTANT.GATEWAY_STUDENT_PREFIX}`,
        clientId,
        studentId
      );
      const countUnread = await this.messageService.countMessageUnreadStudent(studentId);
      client.emit('count-message-unread', countUnread);
      
    }
    if(teacherId) {
      client.join(`Teacher:${teacherId}`);
      await this.redisInstance.hsetnx(
        `${CACHE_CONSTANT.GATEWAY_TEACHER_PREFIX}`,
        clientId,
        teacherId
      );
      const countUnread = await this.messageService.countMessageUnreadTeacher(teacherId);
      client.emit('count-message-unread', countUnread);
    }
  }

  async handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`Message: User disconnected ${clientId}`);
    await this.redisInstance.hdel(
      `${CACHE_CONSTANT.GATEWAY_STUDENT_PREFIX}`,
      clientId
    );
    await this.redisInstance.hdel(
      `${CACHE_CONSTANT.GATEWAY_TEACHER_PREFIX}`,
      clientId
    );
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }
  
  @SubscribeMessage('direct-message')
  async directMessage(
    @MessageBody() data: DirectMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    await this.messageService.directMessageHandler(client, data);
  }
  
  @SubscribeMessage('read-message')
  readMessage(
    @MessageBody() data: ReadMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    this.messageService.readMessageHandler(client, data);
  }
  
  @SubscribeMessage('get-conversations')
  async getConversations(
    @MessageBody() data: GetMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.messageService.getListConversation(client, data);
    client.emit('refresh-conversations', res);
  }
}
