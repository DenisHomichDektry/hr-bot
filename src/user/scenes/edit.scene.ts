import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from '../keyboards';
import { UserService } from '../services/user.service';
import { isUserUpdateDto } from '../types';

@Roles(Role.Admin)
@Scene(Scenes.EditUser)
export class EditUserScene {
  constructor(private readonly userService: UserService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply("Provide user's first name:", {
      reply_markup: {
        keyboard: Keyboards.addUserEnter,
        resize_keyboard: true,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.User, {
      ...ctx.session.__scenes.state,
      user: undefined,
    });
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async saveUser(@Ctx() ctx: SceneContext) {
    const user = ctx.session.__scenes.state.user;

    // first step: first name
    if (user.firstName === undefined) {
      ctx.session.__scenes.state.user.firstName = ctx.message.text;
      await ctx.reply("Provide user's last name:");
      return;
    }

    // second step: last name
    if (user.firstName && !user.lastName) {
      ctx.session.__scenes.state.user.lastName = ctx.message.text;

      const keyboard = await this.userService.getUserRoleKeyboards();

      await ctx.reply("Provide user's role:", {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
        },
      });
      return;
    }

    // third step: role and create
    if (user.firstName && user.lastName && !user.role) {
      user.role = ctx.message.text;

      if (isUserUpdateDto(user)) {
        const userEntity = await this.userService.update({
          ...user,
        });

        if (userEntity) {
          await ctx.reply('User updated!');
          await ctx.scene.enter(Scenes.User, {
            ...ctx.session.__scenes.state,
            user: undefined,
          });
        } else {
          await ctx.reply('User already exists!');
          await ctx.scene.enter(Scenes.User, {
            ...ctx.session.__scenes.state,
            user: undefined,
          });
        }
      }
    }
  }
}
