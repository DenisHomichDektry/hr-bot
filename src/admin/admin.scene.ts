import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from './keyboards';

@Roles(Role.Admin)
@Scene(Scenes.Admin)
export class AdminScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome to Admin Panel!', {
      reply_markup: {
        keyboard: Keyboards.enter,
      },
    });
  }

  @Hears(Actions.UserManagement)
  async userManagement(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.User);
  }

  @Hears(Actions.LinkToWebVersion)
  async linkToWebVersion(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      `<a href="${process.env.WEB_APP_URL}user-management">Web version</a>`,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Start);
  }
}
