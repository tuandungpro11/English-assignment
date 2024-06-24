import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Delete, Param, Patch } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { TeacherCommentService } from './teacher-comment.service';
import { ParamCommentIdDto } from 'src/modules/student/comment/dto/comment-param.dto';
import { UpdateCommentDto } from 'src/modules/student/comment/dto/update-comment.dto';
import { AddCommentAssignmentDto } from 'src/modules/student/comment/dto/add-comment-assignment.dto';

@Controller('teacher/comment')
@ApiTags('Teacher | Comment')
@ApiBearerAuth()
@Roles([Role.Teacher])
export class TeacherCommentController {
  constructor(
    private readonly teacherCommentService: TeacherCommentService
  ) {}

  @ApiOperation({
    summary: 'Thêm bình luận',
  })
  @Post('')
  async addComment(
    @Body() addCommentAssignment: AddCommentAssignmentDto, 
    @JwtDecodedData() data: JwtPayload 
  ): Promise<any> {
    return await this.teacherCommentService.addComment(data.userId, addCommentAssignment);
  }
  
  @ApiOperation({
    summary: 'Chỉnh sửa bình luận',
  })
  @Patch(':commentId')
  async updateComment(
    @Param() paramCommentId: ParamCommentIdDto, 
    @Body() updateComment: UpdateCommentDto,
    @JwtDecodedData() data: JwtPayload
  ): Promise<any> {
    return this.teacherCommentService.updateContentComment(data.userId, paramCommentId.commentId, updateComment);
  }
  
  @ApiOperation({
    summary: 'Xóa bình luận',
  })
  @Delete(':commentId')
  async deleteComment(
    @Param() paramCommentId: ParamCommentIdDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<boolean> {
    return this.teacherCommentService.deleteComment(data.userId, paramCommentId.commentId);
  }
}
