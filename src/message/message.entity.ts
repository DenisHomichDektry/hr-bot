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

  @ManyToOne(() => UserEntity)
  from: UserEntity;

  @ManyToOne(() => UserEntity)
  to: UserEntity;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: string;
}
