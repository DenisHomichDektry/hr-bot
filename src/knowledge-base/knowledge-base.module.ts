import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseEntity } from './entities/knowledge-base.entity';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { KnowledgeBaseCategoryEntity } from './entities/knowledge-base-category.entity';
import { KnowledgeBaseCategoryService } from './services/knowledge-base-category.service';
import {
  AddKnowledgeBaseCategoryScene,
  AddKnowledgeBaseItemScene,
  EditCategoryScene,
  EditKnowledgeBaseItemScene,
  KnowledgeBaseScene,
  RemoveCategoryScene,
  RemoveKnowledgeBaseItemScene,
  ViewKnowledgeBaseItemsScene,
} from './scenes';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KnowledgeBaseEntity,
      KnowledgeBaseCategoryEntity,
    ]),
  ],
  providers: [
    KnowledgeBaseService,
    KnowledgeBaseScene,
    KnowledgeBaseCategoryService,
    AddKnowledgeBaseCategoryScene,
    AddKnowledgeBaseItemScene,
    EditCategoryScene,
    RemoveCategoryScene,
    ViewKnowledgeBaseItemsScene,
    EditKnowledgeBaseItemScene,
    RemoveKnowledgeBaseItemScene,
  ],
})
export class KnowledgeBaseModule {}
