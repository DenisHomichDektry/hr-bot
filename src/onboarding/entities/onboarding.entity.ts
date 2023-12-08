import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

@Entity('onboarding')
export class OnboardingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  link: string;

  @Column()
  order: number;

  @Column('int', {
    array: true,
    nullable: true,
    default: [600000, 600000, 600000, 600000],
  })
  notificationIntervals: number[]; // Store durations in milliseconds

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  reportTo: UserEntity;

  @CreateDateColumn({ nullable: true })
  createdAt: string;
}
