import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { NotificationRepository, TeacherRepository } from 'src/models/repositories';
import { UpdateInformationTeacherDto } from './dto/update-information-teacher.dto';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';
import { FilterNotificationDto } from 'src/modules/student/account/dto/filter-student-notification.dto';


@Injectable()
export class TeacherAccountService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly uploadLocalService: UploadLocalService,
  ) {}

  async getInformationTeacher(userId: number) {
    return await this.teacherRepository.getTeacherById(userId);
  }
  
  async updateInformationTeacher(userId: number, updateInformationTeacher: UpdateInformationTeacherDto, avatar: Express.Multer.File) {
    const teacher = await this.teacherRepository.getTeacherById(userId);
    if (avatar) {
      if (teacher.avatar) {
        await this.uploadLocalService.deleteFile(teacher.avatar)
      }
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      teacher.avatar = avatarImage
    }
    const updateTeacher = await this.teacherRepository.save({
      ...teacher,
      ..._.omit(updateInformationTeacher, ['avatar'])
    })
    return updateTeacher;
  }
  
      
  // async countNotificationUnread() {
  //   return await this.notificationRepository.countNotificationsTeacherUnread();
  // }
  // async getHistoryNotification(filterNotification: FilterNotificationDto) {
  //   const notifications = await this.notificationRepository.getNotifications(filterNotification);
  //   return notifications;
  // }
}