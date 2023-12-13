import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { KnowledgeBaseCategoryEntity } from '../entities/knowledge-base-category.entity';
import {
  BatchUpdateCategoryDto,
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
      where: [
        {
          name: getCategoryDto.name,
        },
        {
          id: getCategoryDto.id,
        },
      ],
    });
  }

  async findAll() {
    return await this.knowledgeBaseCategoryRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async create(categoryDto: CreateCategoryDto) {
    const category = this.knowledgeBaseCategoryRepository.create(categoryDto);
    return await this.knowledgeBaseCategoryRepository.save(category);
  }

  async update(categoryDto: UpdateCategoryDto) {
    const category = await this.findOne({ id: categoryDto.id });

    category.name = categoryDto.name;
    return await this.knowledgeBaseCategoryRepository.save(category);
  }

  async updateBatch(categoryDto: BatchUpdateCategoryDto[]) {
    return await this.knowledgeBaseCategoryRepository.upsert(categoryDto, [
      'id',
    ]);
  }

  async remove(categoryDto: RemoveCategoryDto) {
    const category = await this.findOne({ id: categoryDto.id });
    if (!category) {
      throw new HttpException('Category not found', 404);
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

  async removeBatch(categories: RemoveCategoryDto[]) {
    return await this.knowledgeBaseCategoryRepository.remove(
      categories as KnowledgeBaseCategoryEntity[],
    );
  }
}
