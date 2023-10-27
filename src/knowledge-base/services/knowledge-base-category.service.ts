import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { KnowledgeBaseCategoryEntity } from '../entities/knowledge-base-category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { GetCategoryDto } from '../dto/get-category.dto';

@Injectable()
export class KnowledgeBaseCategoryService {
  constructor(
    @InjectRepository(KnowledgeBaseCategoryEntity)
    private readonly knowledgeBaseCategoryRepository: Repository<KnowledgeBaseCategoryEntity>,
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
}
