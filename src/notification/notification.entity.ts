import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  source: string; // id of the source; at the moment, OnboardingProgressEntity is the only source; in the future, we may have other sources

  @Column({ type: 'timestamp' })
  sendAt: string;

  @CreateDateColumn()
  createdAt: string;
}
