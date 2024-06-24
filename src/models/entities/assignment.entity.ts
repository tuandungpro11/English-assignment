import { TYPE_ASSIGNMENT } from '../../shared/enums/type-assignment.enum';
import { TYPE_QUESTION } from 'src/shared/enums/type-question.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AssignmentSessionEntity } from './assignment-session.entity';
import { BaseEntity } from './base.entity';
import { ClassEntity } from './class.entity';
import { NotificationEntity } from './notification.entity';
import { QuestionEntity } from './question.entity';

@Entity({
  name: 'assignment',
})
export class AssignmentEntity extends BaseEntity {
  @Column()
  name: string;
  
  @Column({
    name: 'total_mark',
    type: 'decimal',
    precision: 10,
    scale: 0,
  })
  totalMark: number;
  
  @Column({ 
    nullable: true,
    name: 'time_start'
  })
  timeStart: Date;
  
  @Column({ 
    nullable: true,
    name: 'time_end'
  })
  timeEnd: Date;
    
  @Column({ 
    nullable: true,
    name: 'time_allow'
  })
  timeAllow: number;
  
  @Column({ 
    name: 'question_count',
    default: 0
  })
  questionCount: number;
  
  @Column({
    nullable: true,
    type: 'enum',
    enum: TYPE_ASSIGNMENT,
    default: null,
  })
  type : TYPE_ASSIGNMENT;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.assignment, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    nullable: true
  })
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;
  
  @OneToMany(() => QuestionEntity, (question) => question.assignment)
  question: QuestionEntity[];
  
  @OneToMany(() => AssignmentSessionEntity, (assignmentSession) => assignmentSession.assignment)
  assignmentSession: AssignmentSessionEntity[];
  
  @OneToMany(() => NotificationEntity, (notification) => notification.assignment)
  notification: NotificationEntity[];
}
