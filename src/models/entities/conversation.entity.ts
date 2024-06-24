import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageEntity } from './message.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'conversation',
})
export class ConversationEntity extends BaseEntity {
  // RELATION
  // -----------------------------------------------------------------------------
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.conversation, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'teacher_id' })
  @Index()
  teacher: TeacherEntity;
  
  @ManyToOne(() => StudentEntity, (student) => student.conversation, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'student_id' })
  @Index()
  student: StudentEntity;
  
  @OneToMany(() => MessageEntity, (message) => message.conversation)
  message: MessageEntity[];
}
