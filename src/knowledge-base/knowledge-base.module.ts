import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseEntity } from './entities/knowledge-base.entity';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { KnowledgeBaseCategoryEntity } from './entities/knowledge-base-category.entity';
import { KnowledgeBaseScene } from './scenes/knowledge-base.scene';
import { KnowledgeBaseCategoryService } from './services/knowledge-base-category.service';
import { AddKnowledgeBaseCategoryScene } from './scenes/add-category.scene';
import { AddKnowledgeBaseItemScene } from './scenes/add-item.scene';
import { EditCategoryScene } from './scenes/edit-category.scene';
import { RemoveCategoryScene } from './scenes/remove-category.scene';

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
  ],
})
export class KnowledgeBaseModule {}
