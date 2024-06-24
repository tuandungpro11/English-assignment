import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtDecodedData } from 'src/shared/decorators/auth.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { ParamAssignmentIdDto } from 'src/modules/teacher/assignment/dto/assignment-param.dto';
import { PracticeRoomService } from './practice-room.service';
import { QueryQuestionDto } from '../assignment/dto/query-assignment.dto';
import { EditAnswerDto } from '../assignment/dto/edit-answer.dto';
import { SaveAssignmentDto } from '../assignment/dto/save-assignment.dto';
import { SubmitAssignmentDto } from '../assignment/dto/submit-assignment.dto';
import { StartPracticeRoomDto } from './dto/start-practice-room.dto';
import { FilterPracticeRoomDto } from './dto/practice-room-query.dto';


@Controller('practice-room')
@ApiBearerAuth()
@ApiTags('Student | Practice Room')
export class PracticeRoomController {
  constructor(
    private readonly practiceRoomService: PracticeRoomService,
  ) {}
  @ApiOperation({
    summary: 'Xem assignment đang làm hoặc đã làm ở phòng luyện',
  })
  @Get('')
  async getAssignment(
    @JwtDecodedData() data: JwtPayload,
    @Query() filterPracticeRoom: FilterPracticeRoomDto, 
  ): Promise<any> {
    console.log('winter-filterPracticeRoom', filterPracticeRoom);
    return this.practiceRoomService.getAssignmentPracticeRoom(data.userId, filterPracticeRoom);
  }
  
  @ApiOperation({
    summary: 'Xem câu hỏi đã làm',
  })
  @Get('question')
  async getQuestionInAssignment(
    @JwtDecodedData() data: JwtPayload,
    @Query() queryQuestion: QueryQuestionDto, 
  ): Promise<any> {
    return this.practiceRoomService.getQuestion(data.userId, queryQuestion);
  }
  
  @ApiOperation({
    summary: 'Update câu trả lời lại của học sinh',
  })
  @Patch('question')
  async updateAnswerQuestion(
    @Body() editAnswer: EditAnswerDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.practiceRoomService.updateAnswerQuestion(data.userId, editAnswer);
  }
  
  @ApiOperation({
    summary: 'Bắt đầu hoặc tiếp tục làm bài',
  })
  @Post('start')
  async startRound(
    @Body() startPracticeRoom: StartPracticeRoomDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.practiceRoomService.start(data.userId, startPracticeRoom);
  }
  
  @ApiOperation({
    summary: 'Lưu kết quả',
  })
  @Post('save')
  async save(
    @Body() saveAssignment: SaveAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.practiceRoomService.save(data.userId, saveAssignment);
  }
  
  @ApiOperation({
    summary: 'Nộp bài',
  })
  @Post('submit')
  async submitRound(
    @Body() submitAssignment: SubmitAssignmentDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.practiceRoomService.submit(data.userId, submitAssignment);
  }
}
