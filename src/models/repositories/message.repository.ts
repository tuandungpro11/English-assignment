import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { MessageEntity } from "../entities";
import { FilterMessageDto } from "src/modules/message/dto/chat-query.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { GetMessageDto } from "src/modules/message/dto/get-message.dto";

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repository: Repository<MessageEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getHistoryChat(conversationId: number, filterMessage: FilterMessageDto): Promise<PaginationResponse<MessageEntity>> {
    const { page, limit, sortOrder } = filterMessage;
    const query = this.createQueryBuilder('message');
    query.innerJoinAndSelect('message.conversation', 'conversation');
    query.innerJoinAndSelect('conversation.student', 'conversationStudent');
    query.innerJoinAndSelect('conversation.teacher', 'conversationTeacher');
    query.leftJoinAndSelect('message.student', 'student');
    query.leftJoinAndSelect('message.teacher', 'teacher');
    query.andWhere('conversation.id = :conversationId', { conversationId });
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    query.orderBy(`message.createdAt`, order);
    
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
  
  async getUnreadMessageStudent(studentId: number): Promise<number> {
    const query = this.createQueryBuilder('message');
    query.innerJoin('message.conversation', 'conversation');
    query.andWhere('conversation.student = :studentId', { studentId });
    query.andWhere('message.isRead = false');
    query.andWhere('message.student is NULL')
    query.select('message.conversation')
    query.distinct(true)
    return query.getCount();
  }
  
  async getUnreadMessageTeacher(teacherId: number): Promise<number> {
    const query = this.createQueryBuilder('message');
    
    const subQuery = query.subQuery()
      .select('1')
      .from('message', 'message')
      .innerJoin('message.conversation', 'conversation')
      .where('conversation.teacher = :teacherId', { teacherId })
      .andWhere('message.isRead = false')
      .andWhere('message.teacher is NULL')
      .groupBy('conversation.id')
      .getQuery();
      
    query.select('COUNT(DISTINCT message.conversation)', 'count')
      .innerJoin('message.conversation', 'conversation')
      .where(`EXISTS (${subQuery})`)
      .andWhere('conversation.teacher = :teacherId', { teacherId })

    const result = await query.getRawOne();
    return parseInt(result.count, 10);
  }
  
    
  async conversationsByStudent(studentId: number, filterConversation: GetMessageDto) {
    const { page, limit } = filterConversation;
    const query = this.createQueryBuilder('message');
    // Subquery để lấy tin nhắn mới nhất cho mỗi cuộc hội thoại
    const subQuery = query.subQuery()
      .select('MAX(message.createdAt)', 'lastMessageTime')
      .from('message', 'message')
      .innerJoin('message.conversation', 'conversation')
      .where('conversation.student = :studentId', { studentId })
      .groupBy('conversation.id')
      .getQuery();

    // Sử dụng subquery trong truy vấn chính
    query.innerJoinAndSelect('message.conversation', 'conversation', 'conversation.student = :studentId', { studentId })
      .where(`message.createdAt IN ${subQuery}`)
      .orderBy('message.createdAt', 'DESC');
    
    query.innerJoinAndSelect('conversation.student', 'conversationStudent');
    query.innerJoinAndSelect('conversation.teacher', 'conversationTeacher');
      
    query.leftJoinAndSelect('message.student', 'student');
    query.leftJoinAndSelect('message.teacher', 'teacher');
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
  
  async conversationsByTeacher(teacherId: number, filterConversation: GetMessageDto) {
    const { page, limit } = filterConversation;
    const query = this.createQueryBuilder('message');
    // Subquery để lấy tin nhắn mới nhất cho mỗi cuộc hội thoại
    const subQuery = query.subQuery()
      .select('MAX(message.createdAt)', 'lastMessageTime')
      .from('message', 'message')
      .innerJoin('message.conversation', 'conversation')
      .where('conversation.teacher = :teacherId', { teacherId })
      .groupBy('conversation.id')
      .getQuery();

    // Sử dụng subquery trong truy vấn chính
    query.innerJoinAndSelect('message.conversation', 'conversation', 'conversation.teacher = :teacherId', { teacherId })
      .where(`message.createdAt IN ${subQuery}`)
      .orderBy('message.createdAt', 'DESC');
      
    query.innerJoinAndSelect('conversation.student', 'conversationStudent');
    query.innerJoinAndSelect('conversation.teacher', 'conversationTeacher');
    
    query.leftJoinAndSelect('message.student', 'student');
    query.leftJoinAndSelect('message.teacher', 'teacher');
    const offset = (page - 1) * limit;
    query.offset(offset).limit(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      metadata: {
        total,
        totalPage: Math.ceil(total / limit) || 1,
        page
      }
    }
  }
}