import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KnowledgeBaseCategoryEntity } from './knowledge-base-category.entity';

@Entity('knowledge_base')
export class KnowledgeBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @ManyToOne(() => KnowledgeBaseCategoryEntity)
  category: KnowledgeBaseCategoryEntity;

  @CreateDateColumn()
  createdAt: string;
}
