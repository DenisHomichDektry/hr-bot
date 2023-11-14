import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { Roles } from 'src/auth/reles.decorator';
import { Role } from 'src/auth/role.enum';

import * as Keyboards from './keyboards';

@Roles(Role.Admin)
@Scene(Scenes.Admin)
export class AdminScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Welcome to Admin Panel!', {
      reply_markup: {
        keyboard: Keyboards.enter,
      },
    });
  }

  @Hears(Actions.UserManagement)
  async userManagement(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.User);
  }

  @Hears(Actions.KnowledgeBaseManagement)
  async knowledgeBaseManagement(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.KnowledgeBase, { management: true });
  }

  @Hears(Actions.OnboardingManagement)
  async onboardingManagement(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Onboarding, { management: true });
  }

  @Hears(Actions.ViewFeedback)
  async viewFeedback(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Feedback, { management: true });
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Start);
  }
}
