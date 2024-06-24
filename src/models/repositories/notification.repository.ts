import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationEntity } from "../entities";
import { FilterNotificationDto } from "src/modules/student/account/dto/filter-student-notification.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { GetNotificationDto } from "src/modules/teacher/notification/dto/get-notification.dto";

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  // async getNotifications(filterNotification: FilterNotificationDto): Promise<PaginationResponse<NotificationEntity>> {
  //   const { page, limit, sortBy, sortOrder, classId } = filterNotification;
  //   const query = this.createQueryBuilder('notification')
  //   if(classId) {
  //     query.andWhere('notification.class = :classId', { classId });
  //   } else {
  //     query.andWhere('notification.class IS NULL');
  //   }
  //   const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';
  //   if (sortBy) {
  //     query.orderBy(`notification.${sortBy}`, order);
  //   } else {
  //     query.orderBy(`notification.createdAt`, order);
  //   }
    
  //   const offset = (page - 1) * limit;
  //   query.offset(offset).limit(limit);
  //   const [data, total] = await query.getManyAndCount();
  //   return {
  //     data,
  //     metadata: {
  //       total,
  //       totalPage: Math.ceil(total / limit) || 1,
  //       page
  //     }
  //   }
  // }
  
  
  async getNotificationsTeacher(filterNotification: GetNotificationDto) {
    const { page, limit } = filterNotification;
    const query = this.createQueryBuilder('notification');
    query.leftJoinAndSelect('notification.class', 'class');
    query.leftJoinAndSelect('notification.student', 'student');
    query.leftJoinAndSelect('notification.assignment', 'assignment');
    query.andWhere('NOT (notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL)');
    query.orderBy('notification.createdAt', 'DESC');
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
  
  async getNotificationsStudent(studentId: number, classIds: [number], filterNotification: GetNotificationDto) {
    const { page, limit } = filterNotification;
    const query = this.createQueryBuilder('notification');
    query.leftJoinAndSelect('notification.class', 'class');
    query.innerJoinAndSelect('notification.teacher', 'teacher');
    query.leftJoinAndSelect('notification.assignment', 'assignment');
    query.where('notification.class IN (:...classIds) OR notification.class IS NULL', { classIds });
    query.orWhere('notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL AND notification.student = :studentId', { studentId });
    query.orderBy('notification.createdAt', 'DESC');
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
  
  // async countNotificationsStudentUnread(studentId: number, classIds: [number]) {
  //   const query = this.createQueryBuilder('notification');
  //   query.where('notification.class IN (:...classIds) OR notification.class IS NULL', { classIds });
  //   query.orWhere('notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL AND notification.student = :studentId', { studentId });
  //   query.andWhere('notification.isRead = false');
  //   return await query.getCount();
  // }
  
  // async countNotificationsTeacherUnread() {
  //   const query = this.createQueryBuilder('notification');
  //   query.andWhere('NOT (notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL)');
  //   query.andWhere('notification.isRead = false');
  //   return await query.getCount();
  // }
  
  async notificationIdsTeacherUnread() {
    const query = this.createQueryBuilder('notification');
    query.andWhere('NOT (notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL)');
    query.select('notification.id');
    const notifications = await query.getMany();
    return notifications.map(notification => notification.id);
  }
  
  async notificationIdsStudentUnread(studentId: number, classIds: [number]) {
    const query = this.createQueryBuilder('notification');
    query.where('notification.class IN (:...classIds) OR notification.class IS NULL', { classIds });
    query.orWhere('notification.teacher IS NOT NULL AND notification.assignment IS NOT NULL AND notification.student = :studentId', { studentId });
    query.select('notification.id');
    const notifications = await query.getMany();
    return notifications.map(notification => notification.id);
  }
}