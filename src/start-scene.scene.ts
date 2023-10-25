import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';
import { Scenes, Actions } from 'src/constants';

import { SceneContext } from './types';
import { AppService } from './app.service';

@Scene(Scenes.Start)
export class StartScene {
  constructor(private readonly appService: AppService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    const keyboard = this.appService.startKeyboard(ctx);
    await ctx.reply("Let's see how I can help you", {
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    });
  }

  @Roles(Role.Admin)
  @Hears(Actions.AdminPanel)
  async adminPanel(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Admin);
  }

  @Hears(Actions.KnowledgeBase)
  async knowledgeBase(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: add knowledge base');
  }
}
