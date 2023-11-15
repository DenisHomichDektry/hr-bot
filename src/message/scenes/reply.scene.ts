import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';

import * as Keyboards from '../keyboards';
import { MessageService } from '../message.service';

@Scene(Scenes.Reply)
export class ReplyScene {
  constructor(private readonly messageService: MessageService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Enter a message. It will be instantly sent to the user.', {
      reply_markup: {
        keyboard: Keyboards.replyEnter,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(
      ctx.session.__scenes.state.previousScene || Scenes.Start,
      {
        ...ctx.session.__scenes.state,
        replyTo: undefined,
        previousScene: undefined,
      },
    );
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async sendMessage(@Ctx() ctx: SceneContext) {
    const message = await this.messageService.sendReplyMessage(
      ctx.message.text,
      ctx.message.from.id,
      ctx.session.__scenes.state.replyTo,
    );

    if (message) {
      await ctx.reply('Your message is sent.');
    } else {
      await ctx.reply(
        'Something went wrong. Please, try other ways to contact User.',
      );
    }
    await ctx.scene.enter(
      ctx.session.__scenes.state.previousScene || Scenes.Start,
      {
        ...ctx.session.__scenes.state,
        replyTo: undefined,
        previousScene: undefined,
      },
    );
  }
}
