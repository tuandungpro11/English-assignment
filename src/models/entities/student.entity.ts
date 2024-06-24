import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GENDER } from '../../shared/enums/gender.enum';
import { Exclude } from 'class-transformer';
import { RoleEntity } from './role.entity';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from './message.entity';
import { AssignmentSessionEntity } from './assignment-session.entity';
import { ClassStudentEntity } from './class-student.entity';
import { CommentEntity } from './comment.entity';
import { NotificationEntity } from './notification.entity';

@Entity({
  name: 'student',
})
export class StudentEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;
  
  @Column()
  name: string;

  @Column()
  address: string;
  
  @Column({
    nullable: true
  })
  avatar: string;
  
  @Column({
    type: 'enum',
    enum: GENDER
  })
  gender: GENDER;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @ManyToOne(() => RoleEntity, (role) => role.student, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity
  
  @OneToMany(() => ConversationEntity, (conversation) => conversation.student)
  conversation: ConversationEntity[];
  
  @OneToMany(() => MessageEntity, (message) => message.student)
  message: MessageEntity[];
  
  @OneToMany(() => AssignmentSessionEntity, (assignmentSession) => assignmentSession.student)
  assignmentSession: AssignmentSessionEntity[];
  
  @OneToMany(() => ClassStudentEntity, (classStudent) => classStudent.student)
  classStudent: ClassStudentEntity[];
  
  @OneToMany(() => CommentEntity, (comment) => comment.student)
  comment: CommentEntity[];
  
  @OneToMany(() => NotificationEntity, (notification) => notification.student)
  notification: NotificationEntity[];
}
