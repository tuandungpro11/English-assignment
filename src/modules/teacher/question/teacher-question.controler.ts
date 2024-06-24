import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ManageQuestionService } from './teacher-question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ParamQuestionIdDto } from './dto/question-param.dto';
import { ParamAssignmentIdDto } from '../assignment/dto/assignment-param.dto';
import { FilterQuestionDto } from './dto/question-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@ApiTags('Teacher | Question')
@ApiBearerAuth()
@Controller('teacher/question')
@Roles([Role.Teacher])
export class ManageQuestionController {
  constructor( private readonly manageQuestionService: ManageQuestionService ) {}
  
  @ApiOperation({
    summary: 'Create a question',
  })
  @Post('')
  async createQuestion(
    @Body() createQuestion: CreateQuestionDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageQuestionService.createQuestion(createQuestion);
  }
  
  @ApiOperation({
    summary: 'Thông tin của 1 question',
  })
  @Get('detail/:questionId')
  async getQuestion(
    @Param() paramQuestionId: ParamQuestionIdDto, 
  ): Promise<any> {
    return this.manageQuestionService.getQuestion(paramQuestionId.questionId);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách các questions',
  })
  @Get('list/:assignmentId')
  async getListQuestion(
    @Param() paramAssignmentId: ParamAssignmentIdDto,
    @Query() filterQuestion: FilterQuestionDto, 
  ): Promise<PaginationResponse<any>> {
    return await this.manageQuestionService.getListQuestion(paramAssignmentId.assignmentId, filterQuestion);
  }
  
  @ApiOperation({
    summary: 'Cập nhật thông tin một question',
  })
  @Patch(':questionId')
  async updateQuestion(
    @Param() paramQuestionId: ParamQuestionIdDto, 
    @Body() updateQuestion: UpdateQuestionDto,
  ): Promise<any> {
    return this.manageQuestionService.updateInformationQuestion(paramQuestionId.questionId, updateQuestion);
  }
  
  @ApiOperation({
    summary: 'Xóa một question',
  })
  @Delete(':questionId')
  async deleteQuestion(
    @Param() paramQuestionId: ParamQuestionIdDto, 
  ): Promise<boolean> {
    return this.manageQuestionService.deleteQuestion(paramQuestionId.questionId);
  }
}
