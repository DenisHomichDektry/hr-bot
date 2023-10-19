import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseEntity } from './knowledge-base.entity';
import { KnowledgeBaseService } from './knowledge-base.service';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBaseEntity])],
  providers: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
