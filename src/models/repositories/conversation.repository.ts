import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { COMMON_CONSTANT } from "src/shared/constants/common.constant";
import { ConversationEntity } from "../entities";
import { GetMessageDto } from "src/modules/message/dto/get-message.dto";

@Injectable()
export class ConversationRepository extends Repository<ConversationEntity> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repository: Repository<ConversationEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  
  async isConversationExist(studentId: number, teacherId: number) {
    const count = await this.count({
      where: {
        student: {
          id: studentId
        },
        teacher: {
          id: teacherId
        }
      }
    });
    return count > 0;
  }
  
  async getConversationByUsers(studentId: number, teacherId: number) {
    const conversation = await this.findOne({
      where: {
        student: {
          id: studentId
        },
        teacher: {
          id: teacherId
        }
      }
    });
    return conversation;
  }
  
  async studentIdsInConversation(teacherId: number) {
    const conversations = await this.find({
      where: {
        teacher: {
          id: teacherId
        }
      }
    });
    return conversations.map(conversation => conversation.student.id);
  }
  
  async teacherIdsInConversation(studentId: number) {
    const conversations = await this.find({
      where: {
        student: {
          id: studentId
        }
      }
    });
    return conversations.map(conversation => conversation.teacher.id);
  }
}