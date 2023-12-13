import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';

import {
  KnowledgeBaseCategoryService,
  KnowledgeBaseService,
} from '../services';

@Scene(Scenes.KnowledgeBase)
export class KnowledgeBaseScene {
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
    await ctx.scene.enter(Scenes.Start);
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async displayCategoryItems(@Ctx() ctx: SceneContext) {
    const category = ctx.message.text;
    const items = await this.knowledgeBaseService.findAll({
      categoryName: category,
    });

    if (items.length === 0) {
      await ctx.reply('No items found!');
    } else {
      for (const item of items) {
        await ctx.reply(`${item.title}\n\n${item.link}`);
      }
    }
  }
}
