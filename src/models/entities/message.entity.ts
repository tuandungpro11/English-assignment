import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { BaseEntity } from './base.entity';
import { ConversationEntity } from './conversation.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({
  name: 'message',
})
export class MessageEntity {
  @Column({ type: 'text' })
  body: string;
  
  @Column({ name: 'is_read', default: false })
  @Index()
  isRead: boolean;
  
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @PrimaryColumn({ name: 'created_at'})
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
  // RELATION
  // -----------------------------------------------------------------------------
  
  @ManyToOne(() => ConversationEntity, (conversation) => conversation.message, {
    eager: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'conversation_id' })
  @Index()
  conversation: ConversationEntity;
  
  @ManyToOne(() => StudentEntity, (student) => student.message, {
    eager: true,
    onDelete: "SET NULL",
    orphanedRowAction: 'nullify',
  })
  @JoinColumn({ name: 'student_id' })
  @Index()
  student: StudentEntity;
  
  @ManyToOne(() => TeacherEntity, (teacher) => teacher.message, {
    eager: true,
    onDelete: "SET NULL",
    orphanedRowAction: 'nullify',
  })
  @JoinColumn({ name: 'teacher_id' })
  @Index()
  teacher: TeacherEntity;
}
