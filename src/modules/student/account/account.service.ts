import { Injectable } from '@nestjs/common';

import _ from 'lodash';
import { ClassStudentRepository, NotificationRepository, StudentRepository, TeacherRepository } from 'src/models/repositories';
import { UpdateInformationStudentDto } from './dto/update-information-student.dto';
import { UploadLocalService } from 'src/providers/upload/local.service';
import { UPLOAD_PATH } from 'src/shared/constants';
import { FilterNotificationDto } from './dto/filter-student-notification.dto';

@Injectable()
export class StudentAccountService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly uploadLocalService: UploadLocalService,
    private readonly classStudentRepository: ClassStudentRepository
  ) {}

  async getInformationStudent(userId: number) {
    return await this.studentRepository.getStudentById(userId);
  }
  
  async updateInformationStudent(userId: number, updateInformationStudent: UpdateInformationStudentDto, avatar: Express.Multer.File) {
    const student = await this.studentRepository.getStudentById(userId);
    if (avatar) {
      if (student.avatar) {
        await this.uploadLocalService.deleteFile(student.avatar)
      }
      const avatarImage: string = (await this.uploadLocalService.putFile(avatar, UPLOAD_PATH.IMAGE, 'avatar'))?.path
      student.avatar = avatarImage
    }
    const updateStudent = await this.studentRepository.save({
      ...student,
      ..._.omit(updateInformationStudent, ['avatar'])
    })
    return updateStudent;
  }
  
  async getListTeacher() {
    return await this.teacherRepository.find();
  }
    
  // async countNotificationUnread(studentId: number) {
  //   const classIds = await this.classStudentRepository.getListClassIdsFromStudent(studentId);
  //   return await this.notificationRepository.countNotificationsStudentUnread(studentId, classIds);
  // }
}