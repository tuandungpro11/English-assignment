import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../../models/entities/role.entity';
import { TeacherEntity } from '../../models/entities/teacher.entity';
import { Role } from '../../shared/enums/role.enum';
import { hash } from 'bcryptjs';
import { COMMON_CONSTANT } from '../../shared/constants/common.constant';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(RoleEntity)
      .values([
        {
          id: 1,
          name: Role.Teacher,
        },
        {
          id: 2,
          name: Role.Student,
        }
      ])
      .execute();
      
      const role = await dataSource.getRepository(RoleEntity).findOne({
        where: {
          name: Role.Teacher
        }
      })
      
      const hashPassword = await hash(
        "123456",
        COMMON_CONSTANT.BCRYPT_SALT_ROUND
      );
      
      await dataSource
        .createQueryBuilder()
        .insert()
        .into(TeacherEntity)
        .values([
          {
            email: 'teacher@gmail.com',
            password: hashPassword,
            name: "Teacher",
            role
          },
        ])
        .execute();
  }
}
