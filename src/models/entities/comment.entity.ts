import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AssignmentSessionEntity } from './assignment-session.entity';
import { BaseEntity } from './base.entity';
import { MessageEntity } from './message.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'comment',
})
export class CommentEntity extends BaseEntity {
  @Column({
    type: 'text'
  })
  body: string;
  
  // RELATION
  // -----------------------------------------------------------------------------
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.comment, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherEntity;
  
  @ManyToOne(() => StudentEntity, (student) => student.comment, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;
  
  @ManyToOne(() => AssignmentSessionEntity, (assignmentSession) => assignmentSession.comment, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'assignment_session_id' })
  @Index()
  assignmentSession: AssignmentSessionEntity;
}
