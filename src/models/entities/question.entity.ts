import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TYPE_QUESTION } from '../../shared/enums/type-question.enum';
import { AssignmentEntity } from './assignment.entity';

@Entity({
  name: 'question',
})
export class QuestionEntity extends BaseEntity {
  @Column({ name: 'is_parent', default: false })
  isParent: boolean;
  
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;
  
  @Column({ 
    type: 'text',
    nullable: true
  })
  body: string;
  
  @Column({ 
    type: 'text',
    nullable: true
  })
  choices: string;
  
  @Column({ 
    type: 'text',
    nullable: true,
    select: false
  })
  instruction: string;
  
  @Column({ 
    type: 'text',
    select: false,
  })
  response: string;
  
  @Column({
    type: 'enum',
    enum: TYPE_QUESTION
  })
  type : TYPE_QUESTION;
  
  @Column({ name: 'question_bank_id', nullable: true })
  questionBankId: number;
  
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => AssignmentEntity, (assignment) => assignment.question, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;
}
