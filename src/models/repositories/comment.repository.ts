import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { CommentEntity } from "../entities";
import { FilterMessageDto } from "src/modules/message/dto/chat-query.dto";
import { PaginationResponse } from "src/shared/types/pagination-options.type";
import { BaseException } from "src/shared/filters/exception.filter";
import { ERROR } from "src/shared/exceptions";

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async getCommentById(id: number): Promise<CommentEntity> {
    const comment = await this.findOne({ where: { id } });
    if(!comment) {
      throw new BaseException(ERROR.NOT_FOUND);
    }
    return comment;
  } 
  
  async getListCommentByAssignment(assignmentSessionId: number) {
    const comments = await this.find({
      where: {
        assignmentSession: {
          id: assignmentSessionId
        }
      }
    });
    return comments;
  }
}