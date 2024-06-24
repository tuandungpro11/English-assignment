import { Controller, Get, Query, Post } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/auth.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ParamNotificationIdDto } from './dto/notification-param.dto';
import { TeacherNotificationService } from './teacher-notification.service';

@Controller('teacher/notification')
@ApiTags('Notification')
@Roles([Role.Teacher])
export class TeacherNotificationController {
  constructor(
    private readonly teacherNotificationService: TeacherNotificationService
  ) {}

}
