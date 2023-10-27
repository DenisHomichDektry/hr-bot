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
      user_id: ctx.message.user_shared.user_id,
    });
  }

  @Hears(Actions.ViewUsers)
  async viewUsers(@Ctx() ctx: SceneContext) {
    const users = await this.userService.findAll();
    for (const user of users) {
      await ctx.reply(
        `${user.firstName} ${user.lastName}\nRole: ${user.role.name}`,
        {
          reply_markup: {
            inline_keyboard: Keyboards.userView,
          },
        },
      );
    }
  }

  @Action(Actions.Edit)
  async edit(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: edit user');
  }

  @Action(Actions.Remove)
  async delete(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: delete user');
  }

  @Hears(Actions.Back)
  async back(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Admin);
  }
}
