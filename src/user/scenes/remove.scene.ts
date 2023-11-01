import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { UserService } from '../services/user.service';

@Roles(Role.Admin)
@Scene(Scenes.RemoveUser)
export class RemoveUserScene {
  constructor(private readonly userService: UserService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      'This action is irreversible. Are you sure you want to delete this user?',
      {
        reply_markup: {
          keyboard: Keyboards.removeUser,
          resize_keyboard: true,
        },
      },
    );
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.User, {
      ...ctx.session.__scenes.state,
      user: undefined,
    });
  }

  @Hears(Actions.Confirm)
  async deleteItem(@Ctx() ctx: SceneContext) {
    const category = await this.userService.remove({
      id: ctx.session.__scenes.state.user.id,
    });

    if (!category) {
      await ctx.reply('User does not exist!');
    } else {
      await ctx.reply('User successfully deleted!');
    }
    await ctx.scene.enter(Scenes.User, {
      ...ctx.session.__scenes.state,
      user: undefined,
    });
  }
}
