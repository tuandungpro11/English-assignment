import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { BaseEntity } from './base.entity';
import { StudentEntity } from './student.entity';
import { StatusAssignmentSession } from '../../shared/enums/status.enum';
import { CommentEntity } from './comment.entity';

@Entity({
  name: 'assignment_session',
})
export class AssignmentSessionEntity extends BaseEntity {
  @Column({
    name: 'mark',
    type: 'decimal',
    precision: 10,
    scale: 0,
    default: 0
  })
  mark: number;
  
  @Column({ 
    name: 'time_start',
    nullable: true
  })
  timeStart: Date;
  
  @Column({ 
    nullable: true,
    name: 'time_end'
  })
  timeEnd: Date;
    
  @Column({ 
    nullable: true,
    name: 'invalid_at'
  })
  invalidAt: Date;
  
  @Column({ 
    name: 'student_answer',
    type: 'text',
    nullable: true
  })
  studentAnswer: string;
  
  @Column({ 
    name: 'answer_count',
    default: 0
  })
  answerCount: number;
  
  @Column({
    nullable: false,
    type: 'enum',
    enum: StatusAssignmentSession,
    default: StatusAssignmentSession.IN_PROGRESS,
    select: false
  })
  @Index()
  status: StatusAssignmentSession;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => StudentEntity, (student) => student.assignmentSession, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;
  
  @ManyToOne(() => AssignmentEntity, (assignment) => assignment.assignmentSession, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;
  
  @OneToMany(() => CommentEntity, (comment) => comment.assignmentSession)
  comment: CommentEntity[];
}
