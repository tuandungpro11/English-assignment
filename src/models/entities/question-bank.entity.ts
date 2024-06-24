import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TYPE_QUESTION } from '../../shared/enums/type-question.enum';

@Entity({
  name: 'question_bank',
})
export class QuestionBankEntity extends BaseEntity {
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
    nullable: true
  })
  instruction: string;
  
  @Column({ 
    type: 'text'
  })
  response: string;
  
  @Column({
    type: 'enum',
    enum: TYPE_QUESTION
  })
  type : TYPE_QUESTION;
}
