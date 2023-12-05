import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseEntity } from './entities/knowledge-base.entity';
import { KnowledgeBaseCategoryEntity } from './entities/knowledge-base-category.entity';
import { KnowledgeBaseCategoryService, KnowledgeBaseService } from './services';
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
import { KnowledgeBaseController } from './knowledge-base.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KnowledgeBaseEntity,
      KnowledgeBaseCategoryEntity,
    ]),
  ],
  controllers: [KnowledgeBaseController],
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
