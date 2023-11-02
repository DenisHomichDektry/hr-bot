import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { OnboardingEntity } from 'src/onboarding/onboarding.entity';

@Entity('notification')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => OnboardingEntity)
  onboardingStep: OnboardingEntity;

  @Column({ type: 'timestamp' })
  sendAt: string;

  @CreateDateColumn()
  createdAt: string;
}
