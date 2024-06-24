import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Delete, Param, Patch } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData, Roles } from 'src/shared/decorators/auth.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { PaginationResponse } from 'src/shared/types/pagination-options.type';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { CommentService } from './comment.service';
import { AddCommentAssignmentDto } from './dto/add-comment-assignment.dto';
import { ParamCommentIdDto } from './dto/comment-param.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@ApiTags('Student | Comment')
@ApiBearerAuth()
@Roles([Role.Student])
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {}

  @ApiOperation({
    summary: 'Thêm bình luận',
  })
  @Post('')
  async addComment(
    @Body() addCommentAssignment: AddCommentAssignmentDto, 
    @JwtDecodedData() data: JwtPayload 
  ): Promise<any> {
    return await this.commentService.addComment(data.userId, addCommentAssignment);
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
    return this.commentService.updateContentComment(data.userId, paramCommentId.commentId, updateComment);
  }
  
  @ApiOperation({
    summary: 'Xóa bình luận',
  })
  @Delete(':commentId')
  async deleteComment(
    @Param() paramCommentId: ParamCommentIdDto, 
    @JwtDecodedData() data: JwtPayload
  ): Promise<boolean> {
    return this.commentService.deleteComment(data.userId, paramCommentId.commentId);
  }
}
