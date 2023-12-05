import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseCategoryService } from '../services';

@Roles(Role.Admin)
@Scene(Scenes.RemoveKnowledgeBaseCategory)
export class RemoveCategoryScene {
  constructor(
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      'This action will delete all items in this category! Are you sure?',
      {
        reply_markup: {
          keyboard: Keyboards.removeKnowledgeBaseCategory,
          resize_keyboard: true,
        },
      },
    );
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }

  @Hears(Actions.Confirm)
  async deleteCategory(@Ctx() ctx: SceneContext) {
    const category = await this.knowledgeBaseCategoryService.remove({
      id: ctx.session.__scenes.state.knowledgeBaseCategory.id,
    });

    if (!category) {
      await ctx.reply('Category does not exist!');
    } else {
      await ctx.reply('Category successfully deleted!');
    }
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }
}
