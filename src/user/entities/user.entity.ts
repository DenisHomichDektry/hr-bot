import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserRoleEntity } from './user-role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  telegramId: number;

  @ManyToOne(() => UserRoleEntity)
  role: UserRoleEntity;

  @Column({ default: false })
  onboardingCompleted: boolean;

  @Column({ default: null })
  onboardingStep: number;

  @CreateDateColumn()
  createdAt: string;
}
