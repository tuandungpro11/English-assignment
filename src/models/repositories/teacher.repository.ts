import { DataSource, IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TeacherEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { COMMON_CONSTANT } from 'src/shared/constants/common.constant';
import { BaseException } from 'src/shared/filters/exception.filter';
import { ERROR } from 'src/shared/exceptions';
import { transformToPlain } from 'src/shared/transformers/class-to-plain.transformer';

@Injectable()
export class TeacherRepository extends Repository<TeacherEntity> {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly repository: Repository<TeacherEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async isTeacherExist(email: string): Promise < boolean > {
    const count = await this.count({ where: { email } });
    return count > 0;
  }
  
  async getTeacherById(id: number): Promise <TeacherEntity> {
    const teacher = await this.findOne({ where: { id } });
    if(!teacher) {
      throw new BaseException(ERROR.USER_NOT_EXIST);
    }
    return transformToPlain<TeacherEntity>(teacher);
  }
  
  async teacherIdsExist() {
    const teacherIds = await this.find({ select: ['id'] });
    return teacherIds.map(teacher => teacher.id);
  }
}
