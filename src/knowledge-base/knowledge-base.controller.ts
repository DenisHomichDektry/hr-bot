import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { KnowledgeBaseCategoryService, KnowledgeBaseService } from './services';
import {
  BatchRemoveCategoryDto,
  BatchUpsertCategoryDto,
  CreateCategoryDto,
  CreateItemWebDto,
  GetAllItemsDto,
  RemoveCategoryDto,
  RemoveItemDto,
  UpdateCategoryDto,
  UpdateItemWebDto,
} from './dto';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  @Get('category')
  async categories() {
    return this.knowledgeBaseCategoryService.findAll();
  }

  @Post('category')
  addCategory(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return this.knowledgeBaseCategoryService.create(createCategoryDto);
  }

  @Patch('category')
  editCategory(@Body() categoryDto: UpdateCategoryDto) {
    return this.knowledgeBaseCategoryService.update(categoryDto);
  }

  @Patch('category/batch')
  async editCategoryBatch(
    @Body(new ValidationPipe()) { data }: BatchUpsertCategoryDto,
  ) {
    return this.knowledgeBaseCategoryService.updateBatch(data);
  }

  @Delete('category/batch')
  async removeCategories(
    @Body(new ValidationPipe()) { data }: BatchRemoveCategoryDto,
  ) {
    return this.knowledgeBaseCategoryService.removeBatch(data);
  }

  @Delete('category/:id')
  removeCategory(@Param(new ValidationPipe()) params: RemoveCategoryDto) {
    return this.knowledgeBaseCategoryService.remove(params);
  }

  @Get('category/:categoryId/item')
  async items(@Param(new ValidationPipe()) getAllItemsDto: GetAllItemsDto) {
    return this.knowledgeBaseService.findAll(getAllItemsDto);
  }

  @Post('item')
  addItem(@Body(new ValidationPipe()) knowledgeBaseDto: CreateItemWebDto) {
    return this.knowledgeBaseService.create(knowledgeBaseDto);
  }

  @Patch('item')
  async editItem(
    @Body(new ValidationPipe()) knowledgeBaseDto: UpdateItemWebDto,
  ) {
    return this.knowledgeBaseService.update(knowledgeBaseDto);
  }

  @Delete('item/:id')
  async removeItem(@Param(new ValidationPipe()) params: RemoveItemDto) {
    return this.knowledgeBaseService.remove(params.id);
  }
}
