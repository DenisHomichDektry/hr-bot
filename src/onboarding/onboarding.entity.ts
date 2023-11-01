import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('onboarding')
export class OnboardingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  order: number;

  @Column('int', { array: true, nullable: true })
  notificationIntervals: number[]; // Store durations in milliseconds

  @CreateDateColumn()
  createdAt: string;
}
