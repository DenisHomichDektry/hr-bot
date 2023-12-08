import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

import { OnboardingEntity } from './onboarding.entity';

@Entity('onboarding_progress')
export class OnboardingProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => OnboardingEntity)
  step: OnboardingEntity;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: string;

  @CreateDateColumn()
  createdAt: string;
}
