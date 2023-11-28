import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { KnowledgeBaseService } from '../services/knowledge-base.service';

@Roles(Role.Admin)
@Scene(Scenes.RemoveKnowledgeBaseItem)
export class RemoveKnowledgeBaseItemScene {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      'This action is irreversible. Are you sure you want to delete this item?',
      {
        reply_markup: {
          keyboard: Keyboards.removeKnowledgeBaseItem,
          resize_keyboard: true,
        },
      },
    );
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.ViewKnowledgeBaseItems, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }

  @Hears(Actions.Confirm)
  async deleteItem(@Ctx() ctx: SceneContext) {
    const category = await this.knowledgeBaseService.remove(
      ctx.session.__scenes.state.knowledgeBaseItem.id,
    );

    if (!category) {
      await ctx.reply('item does not exist!');
    } else {
      await ctx.reply('Item successfully deleted!');
    }
    await ctx.scene.enter(Scenes.ViewKnowledgeBaseItems, {
      ...ctx.session.__scenes.state,
      knowledgeBaseCategory: undefined,
    });
  }
}
