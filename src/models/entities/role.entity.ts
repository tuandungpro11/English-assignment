import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from '../../shared/enums/role.enum';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'role',
})
export class RoleEntity extends BaseEntity {
  @Column({
    transformer: {
      to(value: string) {
        return value.toUpperCase();
      },
      from(value: string) {
        // Do nothing
        return value;
      }
    },
    unique: true,
    nullable: false,
    type: 'enum',
    enum: Role
  })
  name: Role;
  
  @OneToMany(() => StudentEntity, (student) => student.role)
  student: StudentEntity[];
  
  @OneToMany(() => StudentEntity, (teacher) => teacher.role)
  teacher: TeacherEntity[];
}
