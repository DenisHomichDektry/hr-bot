import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Update()
export class AppUpdate {
  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome');
    await ctx.reply('2+2 = ?', {
      reply_markup: {
        keyboard: [
          [{ text: 'Onboarding' }],
          [{ text: 'Knowledge Base' }],
          [{ text: 'Feedback' }],
        ],
      },
    });
  }

  @Help()
  async help(@Ctx() ctx: string) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: SceneContext) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx: SceneContext) {
    await ctx.reply("Hey there. I'm staging");
  }
}
