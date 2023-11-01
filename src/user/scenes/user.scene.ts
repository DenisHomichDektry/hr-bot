import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { Actions, Scenes } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
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

  @Hears(Actions.ViewUsers)
  async viewUsers(@Ctx() ctx: SceneContext) {
    const responseData = await this.userService.viewUsers();

    for (const data of responseData) {
      await ctx.reply(data.text, data.args);
    }

    if (responseData.length === 0) {
      await ctx.reply('No users found!');
    }
  }

  @Action(new RegExp(`^${Actions.Edit}user.*`))
  async edit(@Ctx() ctx: SceneContext) {
    const userId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.EditUser, {
      ...ctx.session.__scenes.state,
      user: {
        id: userId,
      },
    });
  }

  @Action(new RegExp(`^${Actions.Remove}user.*`))
  async remove(@Ctx() ctx: SceneContext) {
    const userId = ctx.callbackQuery.data.split('|')[1];

    await ctx.scene.enter(Scenes.RemoveUser, {
      ...ctx.session.__scenes.state,
      user: {
        id: userId,
      },
    });
  }

  @Hears(Actions.Back)
  async back(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Admin);
  }
}
