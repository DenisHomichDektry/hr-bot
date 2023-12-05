import { Ctx, Hears, Scene, SceneEnter, Action } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
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

  @Roles(Role.Admin)
  @Hears(Actions.AddKnowledgeBaseCategory)
  async addCategory(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      Scenes.AddKnowledgeBaseCategory,
      ctx.session.__scenes.state,
    );
  }

  @Roles(Role.Admin)
  @Hears(Actions.ViewKnowledgeBaseCategories)
  async viewCategories(@Ctx() ctx: SceneContext) {
    const responseData =
      await this.knowledgeBaseCategoryService.viewCategories();

    for (const data of responseData) {
      await ctx.reply(data.text, data.args);
    }

    if (responseData.length === 0) {
      await ctx.reply('No categories found!');
    }
  }

  @Roles(Role.Admin)
  @Hears(Actions.AddKnowledgeBaseItem)
  async addItem(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      Scenes.AddKnowledgeBaseItem,
      ctx.session.__scenes.state,
    );
  }

  @Roles(Role.Admin)
  @Hears(Actions.ViewKnowledgeBaseItems)
  async viewItems(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      Scenes.ViewKnowledgeBaseItems,
      ctx.session.__scenes.state,
    );
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      await ctx.scene.enter(Scenes.Admin);
    } else {
      await ctx.scene.enter(Scenes.Start);
    }
  }

  @Action(new RegExp(`^${Actions.Edit}category.*`))
  async editCategory(@Ctx() ctx: SceneContext) {
    const categoryId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.EditKnowledgeBaseCategory, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: {
        id: categoryId,
      },
    });
  }

  @Action(new RegExp(`^${Actions.Remove}category.*`))
  async removeCategory(@Ctx() ctx: SceneContext) {
    const categoryId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.RemoveKnowledgeBaseCategory, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: {
        id: categoryId,
      },
    });
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
