import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';

import * as Keyboards from '../keyboards';
import { MessageService } from '../message.service';

@Scene(Scenes.Assistance)
export class AssistanceScene {
  constructor(private readonly messageService: MessageService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Please, describe your issue and send message.', {
      reply_markup: {
        keyboard: Keyboards.assistanceEnter,
      },
    });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Onboarding, ctx.session.__scenes.state);
  }

  // all strings except for strings starting with '/' are valid
  @Hears(/^(?!\/).*/)
  async sendMessage(@Ctx() ctx: SceneContext) {
    const message = await this.messageService.sendAssistanceMessage(
      ctx.message.text,
      ctx.message.from.id,
    );

    if (message) {
      await ctx.reply('Your message is sent.');
    } else {
      await ctx.reply(
        'Something went wrong. Please, try other ways to contact Administrator.',
      );
    }
    await ctx.scene.enter(Scenes.Onboarding, ctx.session.__scenes.state);
  }
}
