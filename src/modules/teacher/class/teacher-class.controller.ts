import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { ManageClassService } from './teacher-class.service';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ClassEntity } from 'src/models/entities';
import { CreateClassDto } from './dto/create-class.dto';
import { ParamClassIdDto } from './dto/class-param.dto';
import { FilterClassDto, FilterClassStudentDto } from './dto/class-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { RemoveStudentDto } from './dto/remove-student.dto';

@ApiTags('Teacher | Class')
@ApiBearerAuth()
@Controller('teacher/class')
@Roles([Role.Teacher])
export class ManageClassController {
  constructor( private readonly manageClassService: ManageClassService ) {}
  
  @ApiOperation({
    summary: 'Create a class',
  })
  @Post('')
  async createClass(
    @Body() createClass: CreateClassDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageClassService.createClass(data.userId, createClass);
  }
  
  @ApiOperation({
    summary: 'Thông tin của 1 lớp học',
  })
  @Get('detail/:classId')
  async getClass(
    @Param() paramClassId: ParamClassIdDto, 
  ): Promise<ClassEntity> {
    return this.manageClassService.getClass(paramClassId.classId);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách các lớp học',
  })
  @Get('list')
  async getListClasses(
    @Query() filterClass: FilterClassDto, 
  ): Promise<PaginationResponse<any>> {
    return await this.manageClassService.getListClasses(filterClass);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách học sinh đã được thêm vào lớp học',
  })
  @Get('list-student')
  async getListStudentInClass(
    @Query() filterClassStudentDto: FilterClassStudentDto, 
  ): Promise<PaginationResponse<any>> {
    return await this.manageClassService.getListStudentInClass(filterClassStudentDto);
  }
  
  @ApiOperation({
    summary: 'Cập nhật thông tin một lớp học',
  })
  @Patch(':classId')
  async updateClass(
    @Param() paramClassId: ParamClassIdDto, 
    @Body() updateClass: UpdateClassDto,
  ): Promise<any> {
    return this.manageClassService.updateInformationClass(paramClassId.classId, updateClass);
  }
  
  @ApiOperation({
    summary: 'Xóa một lớp học',
  })
  @Delete(':classId')
  async deleteClass(
    @Param() paramClassId: ParamClassIdDto, 
  ): Promise<boolean> {
    return this.manageClassService.deleteClass(paramClassId.classId);
  }
  
  @ApiOperation({
    summary: 'Thêm học sinh vào lớp học',
  })
  @Post('/add-student')
  async addStudentToClass(
    @Body() addStudent: AddStudentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageClassService.addStudentToClass(data.userId, addStudent);
  }
  
  @ApiOperation({
    summary: 'Xoá học sinh vào lớp học',
  })
  @Post('/remove-student')
  async removeStudentFromClass(
    @Body() removeStudent: RemoveStudentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageClassService.removeStudentFromClass(data.userId, removeStudent);
  }
}
