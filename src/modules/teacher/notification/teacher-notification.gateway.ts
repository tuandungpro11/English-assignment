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

import { RedisService } from '@liaoliaots/nestjs-redis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { DirectNotificationDto } from './dto/direct-notification.dto';
import { TeacherNotificationService } from './teacher-notification.service';
import { AuthenticatedWsGuard } from 'src/shared/guards/authenticated-ws.guard';
import { ClassStudentRepository, NotificationRepository, TeacherRepository } from 'src/models/repositories';
import _ from 'lodash';
import { GetNotificationDto } from './dto/get-notification.dto';

@UseGuards(AuthenticatedWsGuard)
@WebSocketGateway(
  { 
    cors: { origin: true },
  }
)
export class TeacherNotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private redisInstance: Redis;
  
  constructor(
    private readonly redisService: RedisService,
    private readonly teacherNotificationService: TeacherNotificationService,
    private readonly classStudentRepository: ClassStudentRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

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
    this.logger.log(`Notification: User connected ${clientId}`);
    if(studentId) {
      const classIds = await this.classStudentRepository.getListClassIdsFromStudent(studentId);
      _.forEach(classIds, classId => {
        client.join(classId.toString());
      })
    }
  }

  async handleDisconnect(client: Socket) {
    const clientId = client.id.toString();
    this.logger.log(`Notification: User disconnected ${clientId}`);
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }
  
  @SubscribeMessage('direct-notification')
  directNotification(
    @MessageBody() data: DirectNotificationDto,
    @ConnectedSocket() client: Socket
  ) {
    this.teacherNotificationService.directNotificationHandler(client, data);
  }
  
  @SubscribeMessage('teacher-get-notifications')
  async getNotificationsTeacher(
    @MessageBody() data: GetNotificationDto,
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.teacherNotificationService.getNotificationsTeacher(client, data);
    client.emit('refresh-notification', res);
  }
  
  @SubscribeMessage('student-get-notifications')
  async getNotificationsStudent(
    @MessageBody() data: GetNotificationDto,
    @ConnectedSocket() client: Socket
  ) {
    const res = await this.teacherNotificationService.getNotificationStudent(client, data);
    client.emit('refresh-notification', res);
  }

  async studentNotificationCommentAssignment() {
    const teacherIds = await this.teacherRepository.teacherIdsExist();
    const notifications = await this.notificationRepository.getNotificationsTeacher({ page: 1, limit: 20 });
    _.forEach(teacherIds, teacherId => {
      this.server.to(`Teacher:${teacherId}`).emit('refresh-notification', notifications);
    })
  }
  
  async teacherNotificationCommentAssignment(studentId: number) {
    const classIds = await this.classStudentRepository.getListClassIdsFromStudent(studentId);
    const notifications = await this.notificationRepository.getNotificationsStudent(studentId, classIds, { page: 1, limit: 20 });
    this.server.to(`Student:${studentId}`).emit('refresh-notification', notifications);
  }
}
