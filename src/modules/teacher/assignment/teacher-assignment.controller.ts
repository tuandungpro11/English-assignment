import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ManageAssignmentService } from './teacher-assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ParamAssignmentIdDto } from './dto/assignment-param.dto';
import { FilterAssignmentDto } from './dto/assignment-query.dto';
import { ParamClassIdDto } from '../class/dto/class-param.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('Teacher | Assignment')
@ApiBearerAuth()
@Controller('teacher/assignment')
@Roles([Role.Teacher])
export class ManageAssignmentController {
  constructor( private readonly manageAssignmentService: ManageAssignmentService ) {}
  
  @ApiOperation({
    summary: 'Create a assignment',
  })
  @Post('')
  async createAssignment(
    @Body() createAssignment: CreateAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageAssignmentService.createAssignment(createAssignment);
  }
  
  @ApiOperation({
    summary: 'Thông tin của 1 assignment',
  })
  @Get('detail/:assignmentId')
  async getAssignment(
    @Param() paramAssignmentId: ParamAssignmentIdDto, 
  ): Promise<any> {
    return this.manageAssignmentService.getAssignment(paramAssignmentId.assignmentId);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách các assignment',
  })
  @Get('list/:classId')
  async getListAssignment(
    @Param() paramClassId: ParamClassIdDto,
    @Query() filterAssignment: FilterAssignmentDto, 
  ): Promise<any> {
    return await this.manageAssignmentService.getListAssignment(paramClassId.classId, filterAssignment);
  }
  
  @ApiOperation({
    summary: 'Cập nhật thông tin một assignment',
  })
  @Patch(':assignmentId')
  async updateAssignment(
    @Param() paramAssignmentId: ParamAssignmentIdDto, 
    @Body() updateAssignment: UpdateAssignmentDto,
  ): Promise<any> {
    return this.manageAssignmentService.updateInformationAssignment(paramAssignmentId.assignmentId, updateAssignment);
  }
  
  @ApiOperation({
    summary: 'Xóa một assignment',
  })
  @Delete(':assignmentId')
  async deleteAssignment(
    @Param() paramAssignmentId: ParamAssignmentIdDto, 
  ): Promise<boolean> {
    return this.manageAssignmentService.deleteAssignment(paramAssignmentId.assignmentId);
  }
}
