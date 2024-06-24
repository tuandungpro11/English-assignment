import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/auth.decorator';

import { ManageStudentService } from './teacher-student.service';
import { ParamStudentIdDto } from './dto/student-param.dto';
import { FilterStudentDto, QueryAssignmentStudentDto, QueryStudentDto } from './dto/student-query.dto';

@ApiTags('Teacher | Student')
@ApiBearerAuth()
@Controller('teacher/student')
@Roles([Role.Teacher])
export class ManageStudentController {
  constructor(private readonly manageStudentService: ManageStudentService) {}

  @ApiOperation({
    summary: 'Lấy thông tin của học sinh',
  })
  @Get('detail/:studentId')
  async getInformationStudent(
    @Param() paramStudentIdDto: ParamStudentIdDto
  ): Promise<any> {
    return this.manageStudentService.getInformationStudent(
      paramStudentIdDto.studentId
    );
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách học sinh',
  })
  @Get('list')
  async getListStudent(
    @Query() filterStudent: FilterStudentDto
  ): Promise<any> {
    return this.manageStudentService.getListStudent(filterStudent);
  }
  
  @ApiOperation({
    summary: 'Xóa học sinh',
  })
  @Delete(':studentId')
  async deleteStudent(
    @Param() paramStudentId: ParamStudentIdDto
  ): Promise<boolean> {
    return this.manageStudentService.deleteStudent(paramStudentId.studentId);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách assignment làm bài của học sinh',
  })
  @Get('list-assignment')
  async getListAssignmentStudent(
    @Query() queryStudent: QueryStudentDto
  ): Promise<any> {
    return this.manageStudentService.getListAssignmentStudent(
      queryStudent.studentId
    );
  }
  
  @ApiOperation({
    summary: 'Xem chi tiết một assignment đã hoàn thành của học sinh',
  })
  @Get('assignment')
  async getAssignmentStudent(
    @Query() queryAssignmentStudent: QueryAssignmentStudentDto
  ): Promise<any> {
    return this.manageStudentService.getAssignmentStudent(
      queryAssignmentStudent
    );
  }
}