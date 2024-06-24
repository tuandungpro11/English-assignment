import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { BaseEntity } from './base.entity';
import { ClassEntity } from './class.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'notification',
})
export class NotificationEntity extends BaseEntity {
  @Column({
    type: 'text'
  })
  body: string;
  
  // @Column({ name: 'is_read', default: false })
  // @Index()
  // isRead: boolean;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => ClassEntity, (classroom) => classroom.notification, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;
  
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.notification, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherEntity;
  
  @ManyToOne(() => StudentEntity, (student) => student.notification, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;
  
  @ManyToOne(() => AssignmentEntity, (assignment) => assignment.notification, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;
}
