import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseCategoryService } from '../services/knowledge-base-category.service';

@Roles(Role.Admin)
@Scene(Scenes.EditKnowledgeBaseCategory)
export class EditCategoryScene {
  constructor(
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Provide new category name:', {
      reply_markup: {
        keyboard: Keyboards.editKnowledgeBaseCategory,
        resize_keyboard: true,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async saveCategory(@Ctx() ctx: SceneContext) {
    const category = await this.knowledgeBaseCategoryService.update({
      id: ctx.session.__scenes.state.knowledgeBaseCategory.id,
      name: ctx.message.text,
    });

    if (!category) {
      await ctx.reply('Category with this name already exists!');
    } else {
      await ctx.reply('Category successfully updated!');
    }
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }
}
