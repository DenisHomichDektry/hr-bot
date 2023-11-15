import { Update, Ctx, Start, Help, On, Action } from 'nestjs-telegraf';

import { Actions, Scenes } from 'src/constants';

import { AppService } from './app.service';
import { SceneContext } from './types';

@Update()
export class AppUpdate {
  constructor(private readonly appService: AppService) {}

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome to the Dektry Bot!');
    this.appService.updateUsername({
      telegramId: ctx.from.id,
      username: ctx.from.username,
    });
    await ctx.scene.enter(Scenes.Start);
  }

  @Action(new RegExp(`^${Actions.Reply}.*`))
  async reply(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Reply, {
      ...ctx.session.__scenes.state,
      previousScene: ctx.scene.current.id,
      replyTo: ctx.callbackQuery.data.slice(5),
    });
  }

  @Help()
  async help(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: add help message');
  }

  // just for entertainment
  @On('sticker')
  async on(@Ctx() ctx: SceneContext) {
    const stickers = [
      'CAACAgQAAxkBAAICOWU3xeQVdaMGxGTfs8cTqj2Vnq82AAIaAQACa65eCbuUTlT8vkRjMAQ',
      'CAACAgQAAxkBAAICQWU3xlopwcvxJAlwyiuPQ4wXlQABTAACIQEAAmuuXgmhAm0JFBNUtzAE',
      'CAACAgIAAxkBAAICQ2U3xmqUy-pYq-CqdmO2UScV2oXIAAIlAAOTlD0NYC7WpLBLkg4wBA',
      'CAACAgQAAxkBAAICRWU3xnf2PWWg6Muh-OcgiYmnBi0qAAIyAQACa65eCZuVhv2xOyQZMAQ',
      'CAACAgQAAxkBAAICR2U3xoqYM9RDh0w0gxmwB7tPlyanAAIZAQACa65eCUBo-BgW5-ydMAQ',
      'CAACAgIAAxkBAAICSWU3xptr3aoRASKFGcU3siwpdBP8AALrFwACOFvQS2ytXSeKU4UdMAQ',
      'CAACAgQAAxkBAAICS2U3xqvhIuGKe7eqaJH-mLJZ74czAAIlDQAC5-j7Ava4cMR920zWMAQ',
    ];
    const sticker = stickers[Math.floor(Math.random() * stickers.length)];
    await ctx.replyWithSticker(sticker);
  }
}
