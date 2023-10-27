import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseService } from '../services/knowledge-base.service';
import { isCreateItemDto } from '../services/types';

@Roles(Role.Admin)
@Scene(Scenes.AddKnowledgeBaseItem)
export class AddKnowledgeBaseItemScene {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Provide item title:', {
      reply_markup: {
        keyboard: Keyboards.addKnowledgeBaseItem,
        resize_keyboard: true,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, {
      ...ctx.session.__scenes.state,
      knowledgeBaseItem: undefined,
    });
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async saveCategory(@Ctx() ctx: SceneContext) {
    const { knowledgeBaseItem } = ctx.session.__scenes.state;

    // first step: link
    if (knowledgeBaseItem === undefined) {
      ctx.session.__scenes.state.knowledgeBaseItem = {
        title: ctx.message.text,
      };
      await ctx.reply('Provide item link:', {
        reply_markup: {
          keyboard: Keyboards.addKnowledgeBaseItem,
          resize_keyboard: true,
        },
      });
      return;
    }

    // second step: category
    if (knowledgeBaseItem.title && !knowledgeBaseItem.link) {
      ctx.session.__scenes.state.knowledgeBaseItem.link = ctx.message.text;

      const keyboard =
        await this.knowledgeBaseService.getKnowledgeBaseKeyboard();
      await ctx.reply('Choose item category:', {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
        },
      });
      return;
    }

    // third step: create
    if (
      knowledgeBaseItem.title &&
      knowledgeBaseItem.link &&
      !knowledgeBaseItem.category
    ) {
      ctx.session.__scenes.state.knowledgeBaseItem.category = ctx.message.text;

      if (isCreateItemDto(knowledgeBaseItem)) {
        const knowledgeBaseItemEntity = await this.knowledgeBaseService.create(
          knowledgeBaseItem,
        );

        if (knowledgeBaseItemEntity) {
          await ctx.reply('Knowledge base item created!');
        } else {
          await ctx.reply('Knowledge base item creation failed!');
        }
      }

      await ctx.scene.enter(Scenes.KnowledgeBase, {
        ...ctx.session.__scenes.state,
        knowledgeBaseItem: undefined,
      });
    }
  }
}
