import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseService } from '../services/knowledge-base.service';

@Scene(Scenes.KnowledgeBase)
export class KnowledgeBaseScene {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    if (!ctx.session.__scenes.state.management) {
      const keyboard =
        await this.knowledgeBaseService.getKnowledgeBaseKeyboard();

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
    } else {
      await ctx.reply('Welcome to Knowledge Base Management!', {
        reply_markup: {
          keyboard: Keyboards.knowledgeBaseManagementEnter,
          resize_keyboard: true,
        },
      });
    }
  }

  @Hears(Actions.AddKnowledgeBaseCategory)
  async addCategory(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      Scenes.AddKnowledgeBaseCategory,
      ctx.session.__scenes.state,
    );
  }

  @Hears(Actions.RemoveKnowledgeBaseCategory)
  async removeCategory(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: remove category!');
  }

  @Hears(Actions.AddKnowledgeBaseItem)
  async addItem(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      Scenes.AddKnowledgeBaseItem,
      ctx.session.__scenes.state,
    );
  }

  @Hears(Actions.RemoveKnowledgeBaseItem)
  async removeItem(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: remove item!');
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      await ctx.scene.enter(Scenes.Admin);
    } else {
      await ctx.scene.enter(Scenes.Start);
    }
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
