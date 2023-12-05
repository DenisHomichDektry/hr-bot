import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseCategoryService } from '../services';

@Roles(Role.Admin)
@Scene(Scenes.AddKnowledgeBaseCategory)
export class AddKnowledgeBaseCategoryScene {
  constructor(
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Provide category name:', {
      reply_markup: {
        keyboard: Keyboards.addKnowledgeBaseCategory,
        resize_keyboard: true,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, ctx.session.__scenes.state);
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async saveCategory(@Ctx() ctx: SceneContext) {
    if (ctx.message.text?.length > 256) {
      await ctx.reply('Category name is too long!');
      return;
    }
    const category = await this.knowledgeBaseCategoryService.create({
      name: ctx.message.text,
    });

    if (category) {
      await ctx.reply('Category saved!');
    } else {
      await ctx.reply('Category not saved!');
    }
  }
}
