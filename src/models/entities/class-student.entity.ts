import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClassEntity } from './class.entity';
import { StudentEntity } from './student.entity';

@Entity({
  name: 'class_student',
})
@Unique(['class', 'student'])
export class ClassStudentEntity extends BaseEntity {
  @ManyToOne(() => ClassEntity, (classroom) => classroom.classStudent, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @Index()
  class: ClassEntity
  
  @ManyToOne(() => StudentEntity, (student) => student.classStudent, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @Index()
  student: StudentEntity
}
