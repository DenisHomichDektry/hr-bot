import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { Actions, Scenes } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';
import { SceneContext } from 'src/types';

import { UserService } from '../services/user.service';
import * as Keyboards from '../keyboards';

@Roles(Role.Admin)
@Scene(Scenes.User)
export class UserScene {
  constructor(private readonly userService: UserService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome to User Management!', {
      reply_markup: {
        keyboard: Keyboards.enter,
      },
    });
  }

  @On(['user_shared'])
  async userShared(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.AddUser, {
      ...ctx.session.__scenes.state,
      user: {
        telegramId: ctx.message.user_shared.user_id,
      },
    });
  }

  @Hears(Actions.Back)
  async back(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Admin);
  }
}
