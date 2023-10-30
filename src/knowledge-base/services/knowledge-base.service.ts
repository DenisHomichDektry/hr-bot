import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

import { KnowledgeBaseEntity } from '../entities/knowledge-base.entity';
import { KnowledgeBaseCategoryService } from './knowledge-base-category.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { GetAllItemsDto } from '../dto/get-all-items.dto';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseRepository: Repository<KnowledgeBaseEntity>,
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  async findAll(getAllItemsDto: GetAllItemsDto) {
    return await this.knowledgeBaseRepository.find({
      where: {
        category: {
          name: getAllItemsDto.categoryName,
        },
      },
      relations: ['category'],
    });
  }

  async create(knowledgeBaseDto: CreateItemDto) {
    const category = await this.knowledgeBaseCategoryService.findOne({
      name: knowledgeBaseDto.category,
    });

    if (!category) {
      return null;
    }

    const knowledgeBase = this.knowledgeBaseRepository.create({
      ...knowledgeBaseDto,
      category,
    });

    return await this.knowledgeBaseRepository.save(knowledgeBase);
  }

  async getKnowledgeBaseKeyboard() {
    const knowledgeBaseCategoryEntities =
      await this.knowledgeBaseCategoryService.findAll();

    return knowledgeBaseCategoryEntities.reduce((acc, item, currentIndex) => {
      const index = acc.length - 1;

      if (acc[index] === undefined) {
        acc.push([{ text: item.name }]);
      }

      if (acc[index]?.length === 2) {
        acc.push([{ text: item.name }]);
      }

      if (acc[index]?.length < 2) {
        acc[index].push({ text: item.name });
      }

      if (currentIndex === knowledgeBaseCategoryEntities.length - 1) {
        acc.push([{ text: Actions.Back }]);
      }

      return acc;
    }, [] as KeyboardButton[][]);
  }
}
