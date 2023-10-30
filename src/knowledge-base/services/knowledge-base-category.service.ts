import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Actions } from 'src/constants';

import { KnowledgeBaseCategoryEntity } from '../entities/knowledge-base-category.entity';
import {
  CreateCategoryDto,
  GetCategoryDto,
  RemoveCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { KnowledgeBaseEntity } from '../entities/knowledge-base.entity';

@Injectable()
export class KnowledgeBaseCategoryService {
  constructor(
    @InjectRepository(KnowledgeBaseCategoryEntity)
    private readonly knowledgeBaseCategoryRepository: Repository<KnowledgeBaseCategoryEntity>,
    @InjectRepository(KnowledgeBaseEntity)
    private readonly knowledgeBaseEntityRepository: Repository<KnowledgeBaseEntity>,
  ) {}

  async findOne(getCategoryDto: GetCategoryDto) {
    return await this.knowledgeBaseCategoryRepository.findOne({
      where: getCategoryDto,
    });
  }

  async findAll() {
    return await this.knowledgeBaseCategoryRepository.find();
  }

  async create(categoryDto: CreateCategoryDto) {
    const category = this.knowledgeBaseCategoryRepository.create(categoryDto);
    return await this.knowledgeBaseCategoryRepository.save(category);
  }

  async update(categoryDto: UpdateCategoryDto) {
    const category = await this.findOne({ id: categoryDto.id });
    const sameNameCategory = await this.findOne({ name: categoryDto.name });
    if (!category || sameNameCategory) {
      return null;
    }

    category.name = categoryDto.name;
    return await this.knowledgeBaseCategoryRepository.save(category);
  }

  async remove(categoryDto: RemoveCategoryDto) {
    const category = await this.findOne({ id: categoryDto.id });
    if (!category) {
      return null;
    }
    const items = await this.knowledgeBaseEntityRepository.find({
      relations: ['category'],
      where: {
        category: {
          id: category.id,
        },
      },
    });

    if (items.length !== 0) {
      await this.knowledgeBaseEntityRepository.remove(items);
    }

    return await this.knowledgeBaseCategoryRepository.remove(category);
  }

  async viewCategories() {
    const categories = await this.findAll();

    return categories.map((category) => {
      return {
        text: category.name,
        args: {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: Actions.Edit,
                  callback_data: Actions.Edit + 'category|' + category.id,
                },
                {
                  text: Actions.Remove,
                  callback_data: Actions.Remove + 'category|' + category.id,
                },
              ],
            ],
          },
        },
      };
    });
  }
}
