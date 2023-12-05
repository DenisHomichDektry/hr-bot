import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyboardButton } from '@telegraf/types/markup';

import { Actions } from 'src/constants';

import { KnowledgeBaseEntity } from '../entities/knowledge-base.entity';
import { KnowledgeBaseCategoryService } from './knowledge-base-category.service';
import {
  CreateItemDto,
  CreateItemWebDto,
  GetAllItemsDto,
  UpdateItemDto,
  UpdateItemWebDto,
} from '../dto';

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
        category: [
          {
            name: getAllItemsDto.categoryName,
          },
          {
            id: getAllItemsDto.categoryId,
          },
        ],
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async create(knowledgeBaseDto: CreateItemDto | CreateItemWebDto) {
    const category = await this.knowledgeBaseCategoryService.findOne({
      name: 'category' in knowledgeBaseDto ? knowledgeBaseDto.category : '',
      id: 'categoryId' in knowledgeBaseDto ? knowledgeBaseDto.categoryId : '',
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    const knowledgeBase = this.knowledgeBaseRepository.create({
      ...knowledgeBaseDto,
      category,
    });

    return await this.knowledgeBaseRepository.save(knowledgeBase);
  }

  async update(knowledgeBaseDto: UpdateItemDto | UpdateItemWebDto) {
    let category;

    if ('category' in knowledgeBaseDto) {
      category = await this.knowledgeBaseCategoryService.findOne({
        name: knowledgeBaseDto.category,
      });
    }

    if ('categoryId' in knowledgeBaseDto) {
      category = await this.knowledgeBaseCategoryService.findOne({
        id: knowledgeBaseDto.categoryId,
      });
      delete knowledgeBaseDto.categoryId;
    }

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    return await this.knowledgeBaseRepository.update(knowledgeBaseDto.id, {
      ...knowledgeBaseDto,
      category,
    });
  }

  async remove(id: string) {
    const knowledgeBaseItem = await this.knowledgeBaseRepository.findOne({
      where: { id },
    });

    if (!knowledgeBaseItem) {
      throw new HttpException('Item not found', 404);
    }

    return await this.knowledgeBaseRepository.remove(knowledgeBaseItem);
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

  async viewItems(getAllItemsDto: GetAllItemsDto) {
    const items = await this.findAll(getAllItemsDto);

    return items.map((item) => {
      return {
        text: item.title + '\n' + item.link,
        args: {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: Actions.Edit,
                  callback_data: Actions.Edit + 'item|' + item.id,
                },
                {
                  text: Actions.Remove,
                  callback_data: Actions.Remove + 'item|' + item.id,
                },
              ],
            ],
          },
        },
      };
    });
  }
}
