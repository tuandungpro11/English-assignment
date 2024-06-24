import { Body, Controller, Get, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';

import { StudentAccountService } from './account.service';
import { JwtPayload } from 'src/modules/student/auth/dto/jwt-payload.dto';
import { UpdateInformationStudentDto } from './dto/update-information-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidator } from 'src/shared/validators/image-file.validator';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { FilterMessageDto } from 'src/modules/message/dto/chat-query.dto';
import { MessageService } from 'src/modules/message/message.service';
import { FilterStudentMessageDto } from './dto/filter-student-message.dto';
import { ClassGuard } from 'src/shared/guards/class.guard';
import { FilterNotificationDto } from './dto/filter-student-notification.dto';

@Controller('student')
@ApiTags('Student | Account')
@ApiBearerAuth()
export class StudentAccountController {
  constructor(
    private readonly studentAccountService: StudentAccountService,
    private readonly messageService: MessageService,
  ) {}

  @ApiOperation({
    summary: 'Lấy thông tin học sinh',
  })
  @Get('get-me')
  async getInformationStudent(
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.studentAccountService.getInformationStudent(data.userId);
  }

  @ApiOperation({
    summary: 'Cập nhật thông tin học sinh',
  })
  @ApiConsumes('multipart/form-data')
  @Patch('information')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateInformationStudent(
    @Body() updateInformationStudent: UpdateInformationStudentDto,
    @JwtDecodedData() data: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ImageFileValidator({})],
        fileIsRequired: false
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<any> {
    return this.studentAccountService.updateInformationStudent(data.userId, updateInformationStudent, avatar);
  }
  
  @ApiOperation({
    summary: 'Danh sách giáo viên',
  })
  @Get('teacher')
  async getListTeacher(): Promise<any> {
    return await this.studentAccountService.getListTeacher();
  }
  
  @ApiOperation({
    summary: 'Tin nhắn',
  })
  @Get('message')
  async getHistoryChat(
    @Query() filterStudentMessage: FilterStudentMessageDto, 
    @JwtDecodedData() data: JwtPayload,
  ): Promise<PaginationResponse<any>> {
    return await this.messageService.getHistoryChat({...filterStudentMessage, studentId: data.userId});
  }
  
  @ApiOperation({
    summary: 'Số tin nhắn chưa đọc',
  })
  @Get('unread-message')
  async getCountMessageUnread(
    @JwtDecodedData() data: JwtPayload,
  ): Promise<any> {
    return await this.messageService.countMessageUnreadStudent(data.userId);
  }
  
  // @ApiOperation({
  //   summary: 'Số thông báo chưa đọc',
  // })
  // @Get('unread-notification')
  // async getCountNotificationUnread(
  //   @JwtDecodedData() data: JwtPayload,
  // ): Promise<any> {
  //   return await this.studentAccountService.countNotificationUnread(data.userId);
  // }
  
  // @ApiOperation({
  //   summary: 'Thông báo',
  // })
  // @Get('notification')
  // @UseGuards(ClassGuard)
  // async getHistoryNotification(
  //   @Query() filterNotification: FilterNotificationDto, 
  //   @JwtDecodedData() data: JwtPayload,
  // ): Promise<PaginationResponse<any>> {
  //   return await this.studentAccountService.getHistoryNotification(data.userId, filterNotification);
  // }
}