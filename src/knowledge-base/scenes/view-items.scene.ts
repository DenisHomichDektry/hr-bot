import { Ctx, Hears, Scene, SceneEnter, Action } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import { KnowledgeBaseService } from '../services/knowledge-base.service';
import { KnowledgeBaseCategoryService } from '../services/knowledge-base-category.service';

@Roles(Role.Admin)
@Scene(Scenes.ViewKnowledgeBaseItems)
export class ViewKnowledgeBaseItemsScene {
  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly knowledgeBaseCategoryService: KnowledgeBaseCategoryService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    const keyboard = await this.knowledgeBaseService.getKnowledgeBaseKeyboard();

    if (keyboard.length === 0) {
      await ctx.reply('Knowledge Base is empty!');
      await ctx.scene.enter(Scenes.Start);
    } else {
      await ctx.reply('Choose category:', {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
        },
      });
    }
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
    });
  }

  @Action(new RegExp(`^${Actions.Edit}item.*`))
  async editItem(@Ctx() ctx: SceneContext) {
    const itemId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.EditKnowledgeBaseItem, {
      ...ctx.session.__scenes.state,
      knowledgeBaseItem: {
        id: itemId,
      },
    });
  }

  @Action(new RegExp(`^${Actions.Remove}item.*`))
  async removeItem(@Ctx() ctx: SceneContext) {
    const itemId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.RemoveKnowledgeBaseItem, {
      ...ctx.session.__scenes.state,
      knowledgeBaseItem: {
        id: itemId,
      },
    });
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async displayCategoryItems(@Ctx() ctx: SceneContext) {
    const category = ctx.message.text;
    const responseData = await this.knowledgeBaseService.viewItems({
      categoryName: category,
    });

    if (responseData.length === 0) {
      await ctx.reply('No items found!');
    } else {
      for (const data of responseData) {
        await ctx.reply(data.text, data.args);
      }
    }
  }
}
