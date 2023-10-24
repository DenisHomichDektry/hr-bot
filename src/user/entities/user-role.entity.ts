import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: 'admin' | 'user';
}
