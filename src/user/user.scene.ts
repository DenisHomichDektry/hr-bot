import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { Actions, Scenes } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';
import { SceneContext } from 'src/types';

import { UserService } from './services/user.service';
import * as Keyboards from './keyboards';

@Roles(Role.Admin)
@Scene(Scenes.User)
export class UserScene {
  constructor(private readonly userService: UserService) {}

  private chat_id: number; // chat id that used to fetch user information https://core.telegram.org/bots/api#getchatmember

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
    if (this.chat_id === undefined) {
      await ctx.reply('Please share chat with user first');
    } else {
      const userInfo = await ctx.telegram.getChatMember(
        this.chat_id,
        ctx.message.user_shared.user_id,
      );

      const user = await this.userService.create({
        telegramId: userInfo.user.id,
        firstName: userInfo.user.first_name,
        lastName: userInfo.user.last_name,
      });
      if (user) {
        await ctx.reply('User has been added successfully.');
      } else {
        await ctx.reply('User already exists.');
      }
    }
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

  @On(['chat_shared'])
  async chatShared(@Ctx() ctx: SceneContext) {
    this.chat_id = ctx.message.chat_shared.chat_id;
    await ctx.reply("I'll use this chat id to fetch user information.");
  }

  @Hears(Actions.Back)
  async back(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Admin);
  }
}
