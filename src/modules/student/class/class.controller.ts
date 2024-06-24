import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtDecodedData, Public } from 'src/shared/decorators/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { FilterClassDto } from 'src/modules/teacher/class/dto/class-query.dto';
import { ClassService } from './class.service';
import { ParamClassIdDto } from 'src/modules/teacher/class/dto/class-param.dto';
import { QueryStatusAssignmentDto } from './dto/query-status-assignment.dto';
import { ClassGuard } from 'src/shared/guards/class.guard';
import { FilterAssignmentDto } from 'src/modules/teacher/assignment/dto/assignment-query.dto';

@Controller('class')
@ApiTags('Student | Class')
@ApiBearerAuth()
export class ClassController {
  constructor(
    private readonly classService: ClassService
  ) {}
  
  @ApiOperation({
    summary: 'Danh sách lớp học của tôi',
  })
  @Get('me')
  async getMyClasses(
    @JwtDecodedData() data: JwtPayload,
    @Query() filterClass: FilterClassDto, 
  ): Promise<any> {
    return this.classService.getMyClasses(data.userId, filterClass);
  }
  
  @ApiOperation({
    summary: 'Danh sách assignment',
  })
  @Get(':classId')
  @UseGuards(ClassGuard)
  async getAssignments(
    @JwtDecodedData() data: JwtPayload,
    @Param() paramClassId: ParamClassIdDto,
    @Query() filterAssignment: FilterAssignmentDto,
  ): Promise<any> {
    return this.classService.getAssignments(data.userId, paramClassId.classId, filterAssignment);
  }
  
  @ApiOperation({
    summary: 'Thống kê số liệu dạng bài của mình ở lớp học',
  })
  @Get('analysis/:classId')
  @UseGuards(ClassGuard)
  async analysisResultStudent(
    @JwtDecodedData() data: JwtPayload,
    @Param() paramClassId: ParamClassIdDto,
  ): Promise<any> {
    return this.classService.analysisResultStudent(data.userId, paramClassId.classId);
  }
}
