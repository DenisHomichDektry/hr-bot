import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  from: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  to: UserEntity;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: string;
}
