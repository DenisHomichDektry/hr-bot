import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

@Roles(Role.Admin)
@Scene(Scenes.Admin)
export class AdminScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome to Admin Panel!', {
      reply_markup: {
        keyboard: [
          [
            { text: Actions.UserManagement },
            { text: Actions.KnowledgeBaseManagement },
          ],
          [{ text: Actions.OnboardingManagement }, { text: Actions.Back }],
        ],
      },
    });
  }

  @Hears(Actions.UserManagement)
  async userManagement(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.User);
  }

  @Hears(Actions.KnowledgeBaseManagement)
  async knowledgeBaseManagement(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: add knowledge base management');
  }

  @Hears(Actions.OnboardingManagement)
  async onboardingManagement(@Ctx() ctx: SceneContext) {
    await ctx.reply('TODO: add onboarding management');
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Start);
  }
}
