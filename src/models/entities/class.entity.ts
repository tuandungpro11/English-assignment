import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { BaseEntity } from './base.entity';
import { ClassStudentEntity } from './class-student.entity';
import { NotificationEntity } from './notification.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'class',
})
export class ClassEntity extends BaseEntity {
  @Column()
  name: string;
  
  @Column({ nullable: true, type: 'text' })
  description: string;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.class, {
    eager: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'nullify',
    nullable: true
  })
  @JoinColumn({ name: 'creator_id' })
  creator: TeacherEntity;
  
  @OneToMany(() => AssignmentEntity, (assignment) => assignment.class)
  assignment: AssignmentEntity[];
  
  @OneToMany(() => ClassStudentEntity, (classStudent) => classStudent.class)
  classStudent: ClassStudentEntity[];
  
  @OneToMany(() => NotificationEntity, (notification) => notification.class)
  notification: NotificationEntity[];
}
