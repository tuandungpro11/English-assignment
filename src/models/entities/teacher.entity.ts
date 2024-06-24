import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { RoleEntity } from './role.entity';
import { ClassEntity } from './class.entity';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from './message.entity';
import { CommentEntity } from './comment.entity';
import { NotificationEntity } from './notification.entity';

@Entity({
  name: 'teacher',
})
export class TeacherEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;
  
  @Column()
  name: string;
  
  @Column({
    nullable: true
  })
  avatar: string;
  
  // RELATION
  // -----------------------------------------------------------------------------

  @ManyToOne(() => RoleEntity, (role) => role.teacher, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
  
  @OneToMany(() => ClassEntity, (classEntity) => classEntity.creator)
  class: ClassEntity[];
  
  @OneToMany(() => ConversationEntity, (conversation) => conversation.teacher)
  conversation: ConversationEntity[];
  
  @OneToMany(() => MessageEntity, (message) => message.teacher)
  message: MessageEntity[];
  
  @OneToMany(() => CommentEntity, (comment) => comment.teacher)
  comment: CommentEntity[];
  
  @OneToMany(() => NotificationEntity, (notification) => notification.teacher)
  notification: NotificationEntity[];
}
