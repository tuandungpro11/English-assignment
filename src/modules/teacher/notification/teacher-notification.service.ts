import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ConversationRepository } from 'src/models/repositories/conversation.repository';
import Redis from 'ioredis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConversationEntity, MessageEntity, NotificationEntity } from 'src/models/entities';
import { ClassRepository, ClassStudentRepository, MessageRepository, NotificationRepository, StudentRepository, TeacherRepository } from 'src/models/repositories';
import _ from 'lodash';
import { DirectNotificationDto } from './dto/direct-notification.dto';
import { GetNotificationDto } from './dto/get-notification.dto';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { In } from 'typeorm';

@Injectable()
export class TeacherNotificationService {
  @WebSocketServer() server: Server;
  private redisInstance: Redis;
  
  constructor(
    private readonly redisService: RedisService,
    private readonly classRepository: ClassRepository,
    private readonly classStudentRepository: ClassStudentRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }
  
  async directNotificationHandler(client: Socket, data: DirectNotificationDto) {
    const { body, classId } = data;
    const teacherId = client.handshake.auth?.teacherId;
    
    if(teacherId) {
      const teacher = await this.teacherRepository.getTeacherById(teacherId);
      const newNotification = new NotificationEntity();
      newNotification.body = body;
      newNotification.teacher = teacher;
      if(classId) {
        const classroom = await this.classRepository.getClassById(classId);
        newNotification.class = classroom;
        await this.notificationRepository.save(newNotification);
        client.to(classId.toString()).emit('new-notification', { body, teacher });
      } else {
        await this.notificationRepository.save(newNotification);
        client.broadcast.emit('new-notification', { body, teacher });
      }
    }
  }
  
  async getNotificationsTeacher(client: Socket, data: GetNotificationDto) {
    const teacherId = client.handshake.auth?.teacherId;
    
    if(teacherId) {
      const notifications = await this.notificationRepository.getNotificationsTeacher(data);
      return notifications;
    }
    return [];
  }
  
  async getNotificationStudent(client: Socket, data: GetNotificationDto) {
    const studentId = client.handshake.auth?.studentId;
    
    if(studentId) {
      const classIds = await this.classStudentRepository.getListClassIdsFromStudent(studentId);
      const notifications = await this.notificationRepository.getNotificationsStudent(studentId, classIds, data);
      return notifications;
    }
    return [];
  }
  
  async testApi() {
    const notifications = await this.notificationRepository.getNotificationsTeacher({ page: 1, limit: 20 });
    return notifications;
  }
  
  async studentNotificationCommentAssignment() {
    const teacherIds = await this.teacherRepository.teacherIdsExist();
    const notifications = await this.notificationRepository.getNotificationsTeacher({ page: 1, limit: 20 });
    console.log('winter:', teacherIds);
    _.forEach(teacherIds, teacherId => {
      this.server.to(`Teacher:${teacherId}`).emit('refresh-notification', notifications);
    })
  }
  
  async teacherNotificationCommentAssignment(studentId: number) {
    const classIds = await this.classStudentRepository.getListClassIdsFromStudent(studentId);
    const notifications = await this.notificationRepository.getNotificationsStudent(studentId, classIds, { page: 1, limit: 20 });
    this.server.to(`Student:${studentId}`).emit('refresh-notification', notifications);
  }
  
  // async markNotification(notificationId: number) {
  //   const { affected } = await this.notificationRepository.update({ id: notificationId }, { isRead: true });
  //   if (affected <= 0) {
  //     throw new BaseException(ERROR.DELETE_FAILED);
  //   }
  //   return true;
  // }
  
  // async markAllNotification() {
  //   const notificationIds = await this.notificationRepository.notificationIdsTeacherUnread();
  //   const { affected } = await this.notificationRepository.update({ id: In(notificationIds) }, { isRead: true });
  //   if (affected <= 0) {
  //     throw new BaseException(ERROR.DELETE_FAILED);
  //   }
  //   return true;
  // }
  // async getHistoryChat(filterMessage: FilterMessageDto) {
  //   const { studentId, teacherId } = filterMessage;
  //   const conversation = await this.conversationRepository.getConversationByUsers(studentId, teacherId);
  //   if(!conversation) {
  //     return {
  //       data: [],
  //       metadata: {
  //         total: 0,
  //         totalPage: 1,
  //         page: 1
  //       }
  //     }
  //   }
  //   const messages = await this.messageRepository.getHistoryChat(conversation.id, filterMessage);
  //   return messages;
  // }
}
