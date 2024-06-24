import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import {
  JwtDecodedData,
  Roles,
} from 'src/shared/decorators/auth.decorator';

import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { ClassEntity } from 'src/models/entities';
import { CreateQuestionBankDto, QuestionDto } from '../question/dto/create-question.dto';
import { ManageQuestionBankService } from './question-bank.service';
import { FilterQuestionDto } from '../question/dto/question-query.dto';
import { UpdateQuestionDto } from '../question/dto/update-question.dto';
import { ParamQuestionBankIdDto } from './dto/param-question-bank.dto';

@ApiTags('Teacher | Question Bank')
@ApiBearerAuth()
@Controller('teacher/question-bank')
@Roles([Role.Teacher])
export class ManageQuestionBankController {
  constructor( private readonly manageQuestionBankService: ManageQuestionBankService ) {}
  
  @ApiOperation({
    summary: 'Create a question in bank',
  })
  @Post('')
  async createQuestionInBank(
    @Body() createQuestion: CreateQuestionBankDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.manageQuestionBankService.createQuestionInBank(createQuestion);
  }
  
  @ApiOperation({
    summary: 'Thông tin của 1 question trong bank',
  })
  @Get('detail/:questionBankId')
  async getQuestionInBank(
    @Param() paramQuestionBankId: ParamQuestionBankIdDto, 
  ): Promise<any> {
    return this.manageQuestionBankService.getQuestionInBank(paramQuestionBankId.questionBankId);
  }
  
  @ApiOperation({
    summary: 'Lấy danh sách các questions trong bank',
  })
  @Get('list')
  async getListQuestionInBank(
    @Query() filterQuestion: FilterQuestionDto, 
  ): Promise<PaginationResponse<any>> {
    return await this.manageQuestionBankService.getListQuestionInBank(filterQuestion);
  }
  
  @ApiOperation({
    summary: 'Cập nhật thông tin một question trong bank',
  })
  @Patch(':questionBankId')
  async updateQuestion(
    @Param() paramQuestionBankId: ParamQuestionBankIdDto, 
    @Body() updateQuestion: UpdateQuestionDto,
  ): Promise<any> {
    return this.manageQuestionBankService.updateInformationQuestionInBank(paramQuestionBankId.questionBankId, updateQuestion);
  }
  
  @ApiOperation({
    summary: 'Xóa một question trong bank',
  })
  @Delete(':questionBankId')
  async deleteQuestion(
    @Param() paramQuestionBankId: ParamQuestionBankIdDto, 
  ): Promise<boolean> {
    return this.manageQuestionBankService.deleteQuestionInBank(paramQuestionBankId.questionBankId);
  }
}
