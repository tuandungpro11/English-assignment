import { Injectable } from '@nestjs/common';
import { DirectMessageDto } from './dto/direct-message.dto';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ConversationRepository } from 'src/models/repositories/conversation.repository';
import Redis from 'ioredis';
import { CACHE_CONSTANT, COMMON_CONSTANT } from 'src/shared/constants';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ConversationEntity, MessageEntity } from 'src/models/entities';
import { MessageRepository, StudentRepository, TeacherRepository } from 'src/models/repositories';
import _ from 'lodash';
import { FilterMessageDto } from './dto/chat-query.dto';
import { ReadMessageDto } from './dto/read-message.dto';
import { GetMessageDto } from './dto/get-message.dto';

@Injectable()
export class MessageService {
  @WebSocketServer() server: Server;
  private redisInstance: Redis;
  
  constructor(
    private readonly redisService: RedisService,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherRepository: TeacherRepository
  ) {
    this.redisInstance = this.redisService.getClient(
      COMMON_CONSTANT.REDIS_DEFAULT_NAMESPACE
    );
  }
  
  async directMessageHandler(client: Socket, data: DirectMessageDto) {
    const { body, studentId, teacherId } = data;
    const senderStudent = client.handshake.auth?.studentId;
    const senderTeacher = client.handshake.auth?.teacherId;
    
    if(senderStudent && teacherId) {
      let conversation = await this.conversationRepository.getConversationByUsers(senderStudent, teacherId);
      const student = await this.studentRepository.getStudentById(senderStudent);
      const teacher = await this.teacherRepository.getTeacherById(teacherId);
      if(!conversation) {
        const newConversation = new ConversationEntity();
        newConversation.student = student;
        newConversation.teacher = teacher;
        conversation = await this.conversationRepository.save(newConversation);
      }
      const newMessage = new MessageEntity();
      newMessage.body = body;
      newMessage.conversation = conversation;
      newMessage.student = student;
      newMessage.createdAt = new Date();
      const saveMessage = await this.messageRepository.save(newMessage);
      client.to(`Teacher:${teacherId}`).emit('new-message', saveMessage);
      const resTeacher = await this.messageRepository.conversationsByTeacher(teacherId, { page: 1, limit: 50 });
      client.to(`Teacher:${teacherId}`).emit('refresh-conversations', resTeacher);
      const resStudent = await this.messageRepository.conversationsByStudent(senderStudent, { page: 1, limit: 50 });
      client.emit('refresh-conversations', resStudent);
    } else if(senderTeacher && studentId) {
      let conversation = await this.conversationRepository.getConversationByUsers(studentId, senderTeacher);
      const student = await this.studentRepository.getStudentById(studentId);
      const teacher = await this.teacherRepository.getTeacherById(senderTeacher);
      if(!conversation) {
        const newConversation = new ConversationEntity();
        newConversation.student = student;
        newConversation.teacher = teacher;
        conversation = await this.conversationRepository.save(newConversation);
      }
      const newMessage = new MessageEntity();
      newMessage.body = body;
      newMessage.conversation = conversation;
      newMessage.teacher = teacher;
      newMessage.createdAt = new Date();
      const saveMessage = await this.messageRepository.save(newMessage);
      client.to(`Student:${studentId}`).emit('new-message', saveMessage);
      const resStudent = await this.messageRepository.conversationsByStudent(studentId, { page: 1, limit: 50 });
      client.to(`Student:${studentId}`).emit('refresh-conversations', resStudent);
      const resTeacher = await this.messageRepository.conversationsByTeacher(senderTeacher, { page: 1, limit: 50 });
      client.emit('refresh-conversations', resTeacher);
    } else {
      // throw new UnauthorizedException();
    }
  }
  
  async readMessageHandler(client: Socket, data: ReadMessageDto) {
    const { studentId, teacherId } = data;
    const senderStudent = client.handshake.auth?.studentId;
    const senderTeacher = client.handshake.auth?.teacherId;
    if(senderStudent && teacherId) {
      const conversation = await this.conversationRepository.getConversationByUsers(senderStudent, teacherId);
      if(!conversation) {
        return;
      }
      await this.messageRepository.update({
        conversation: { id: conversation.id },
        teacher: { id: teacherId },
        isRead: false
      }, { isRead: true })
      const res = await this.countMessageUnreadStudent(senderStudent);
      client.emit('count-message-unread', { count: res.count });
    } else if(senderTeacher && studentId) {
      const conversation = await this.conversationRepository.getConversationByUsers(studentId, senderTeacher);
      if(!conversation) {
        return;
      }
      await this.messageRepository.update({
        conversation: { id: conversation.id },
        student: { id: studentId },
        isRead: false
      }, { isRead: true })
      const res = await this.countMessageUnreadTeacher(senderStudent);
      client.emit('count-message-unread', { count: res.count });
    } else {
      // throw new UnauthorizedException();
    }
  }
  
  async getListConversation(client: Socket, data: GetMessageDto) {
    const studentId = client.handshake.auth?.studentId;
    const teacherId = client.handshake.auth?.teacherId;
    if(studentId) {
      return await this.messageRepository.conversationsByStudent(studentId, data);
    } else if(teacherId) {
      return await this.messageRepository.conversationsByTeacher(teacherId, data);
    } else {
      return []
    }
  }
  
  async getHistoryChat(filterMessage: FilterMessageDto) {
    const { studentId, teacherId } = filterMessage;
    const conversation = await this.conversationRepository.getConversationByUsers(studentId, teacherId);
    if(!conversation) {
      return {
        data: [],
        metadata: {
          total: 0,
          totalPage: 1,
          page: 1
        }
      }
    }
    const messages = await this.messageRepository.getHistoryChat(conversation.id, filterMessage);
    return messages;
  }
  
  async countMessageUnreadStudent(studentId: number) {
    const count = await this.messageRepository.getUnreadMessageStudent(studentId);
    return {
      count
    }
  }
  
  async countMessageUnreadTeacher(teacherId: number) {
    const count = await this.messageRepository.getUnreadMessageTeacher(teacherId);
    return {
      count
    }
  }
}
