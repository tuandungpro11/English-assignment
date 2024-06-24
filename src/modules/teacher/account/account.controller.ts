import { Body, Controller, Get, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';

import { TeacherAccountService } from './account.service';
import { JwtPayload } from 'src/modules/teacher/auth/dto/jwt-payload.dto';
import { UpdateInformationTeacherDto } from './dto/update-information-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';
import { FilterMessageDto } from 'src/modules/message/dto/chat-query.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { MessageService } from 'src/modules/message/message.service';
import { FilterTeacherMessageDto } from './dto/filter-message-teacher.dto';
import { FilterNotificationDto } from 'src/modules/student/account/dto/filter-student-notification.dto';
import { Role } from 'src/shared/enums/role.enum';

@Controller('teacher')
@ApiTags('Teacher | Account')
@ApiBearerAuth()
@Roles([Role.Teacher])
export class TeacherAccountController {
  constructor(
    private readonly teacherAccountService: TeacherAccountService,
    private readonly messageService: MessageService
  ) {}

  @ApiOperation({
    summary: 'Lấy thông tin giáo viên',
  })
  @Get('get-me')
  async getInformationTeacher(
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.teacherAccountService.getInformationTeacher(data.userId);
  }

  @ApiOperation({
    summary: 'Cập nhật thông tin giáo viên',
  })
  @ApiConsumes('multipart/form-data')
  @Patch('information')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateInformationTeacher(
    @Body() updateInformationTeacher: UpdateInformationTeacherDto,
    @JwtDecodedData() data: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<any> {
    return this.teacherAccountService.updateInformationTeacher(data.userId, updateInformationTeacher, avatar);
  }
  
  @ApiOperation({
    summary: 'Tin nhắn',
  })
  @Get('message')
  async getHistoryChat(
    @Query() filterTeacherMessage: FilterTeacherMessageDto, 
    @JwtDecodedData() data: JwtPayload,
  ): Promise<PaginationResponse<any>> {
    return await this.messageService.getHistoryChat({...filterTeacherMessage, teacherId: data.userId});
  }
  
  @ApiOperation({
    summary: 'Số tin nhắn chưa đọc',
  })
  @Get('unread-message')
  async getCountMessageUnread(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return await this.messageService.countMessageUnreadTeacher(data.userId);
  }
  
  // @ApiOperation({
  //   summary: 'Số thông báo chưa đọc',
  // })
  // @Get('unread-notification')
  // async getCountNotificationUnread(
  //   @JwtDecodedData() data: JwtPayload,
  // ): Promise<any> {
  //   return await this.teacherAccountService.countNotificationUnread();
  // }
  
  // @ApiOperation({
  //   summary: 'Thông báo',
  // })
  // @Get('notification')
  // async getHistoryNotification(
  //   @Query() filterNotification: FilterNotificationDto, 
  //   @JwtDecodedData() data: JwtPayload,
  // ): Promise<PaginationResponse<any>> {
  //   return await this.teacherAccountService.getHistoryNotification(filterNotification);
  // }
}