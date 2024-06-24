import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { AssignmentService } from './assignment.service';
import { StartAssignmentDto } from './dto/start-assignment.dto';
import { SaveAssignmentDto } from './dto/save-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { ParamClassIdDto } from 'src/modules/teacher/class/dto/class-param.dto';
import { ParamAssignmentIdDto } from 'src/modules/teacher/assignment/dto/assignment-param.dto';
import { QueryAssignmentDto, QueryQuestionDto } from './dto/query-assignment.dto';
import { EditAnswerDto } from './dto/edit-answer.dto';


@Controller('assignment')
@ApiTags('Student | Assignment')
@ApiBearerAuth()
export class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
  ) {}
  
  @ApiOperation({
    summary: 'Lấy tiến độ hoàn thành bài tập trong lớp của 1 học sinh',
  })
  @Get('count-completed')
  async CountCompleted(
    @Query() queryClassId: ParamClassIdDto,
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.assignmentService.countCompleted(data.userId, queryClassId.classId);
  }
  
  @ApiOperation({
    summary: 'Thống kê điểm của bài tập',
  })
  @Get('rank')
  async getRankAssignment(
    @JwtDecodedData() data: JwtPayload,
    @Query() queryAssignment: QueryAssignmentDto, 
  ): Promise<any> {
    return this.assignmentService.getRankAssignment(queryAssignment);
  }
  
  @ApiOperation({
    summary: 'Xem câu hỏi đã làm',
  })
  @Get('question')
  async getQuestionInAssign(
    @JwtDecodedData() data: JwtPayload,
    @Query() queryQuestion: QueryQuestionDto, 
  ): Promise<any> {
    return this.assignmentService.getQuestion(data.userId, queryQuestion);
  }
  
  @ApiOperation({
    summary: 'Update câu trả lời lại của học sinh',
  })
  @Patch('question')
  async updateAnswerQuestion(
    @Body() editAnswer: EditAnswerDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.assignmentService.updateAnswerQuestion(data.userId, editAnswer);
  }
  
  @ApiOperation({
    summary: 'Bắt đầu hoặc tiếp tục làm bài',
  })
  @Post('start')
  async startRound(
    @Body() startAssignment: StartAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.assignmentService.start(data.userId, startAssignment);
  }
  
  @ApiOperation({
    summary: 'Lưu kết quả',
  })
  @Post('save')
  async save(
    @Body() saveAssignment: SaveAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.assignmentService.save(data.userId, saveAssignment);
  }
  
  @ApiOperation({
    summary: 'Nộp bài',
  })
  @Post('submit')
  async submitRound(
    @Body() submitAssignment: SubmitAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.assignmentService.submit(data.userId, submitAssignment);
  }
}
