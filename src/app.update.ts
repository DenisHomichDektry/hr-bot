import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { Update as UpdateNameSpace } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';

import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

@Roles(Role.Admin)
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
  async help(@Ctx() ctx: SceneContext) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: SceneContext) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(
    @Ctx() ctx: SceneContext & { update: UpdateNameSpace.MessageUpdate },
  ) {
    console.log(ctx.update.message.from);
    await ctx.reply("Hey there. I'm staging. Test");
  }
}
