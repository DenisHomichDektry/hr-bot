import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';

import * as Keyboards from './keyboards';
import { OnboardingService } from './onboarding.service';

@Scene(Scenes.Onboarding)
export class OnboardingScene {
  constructor(private readonly onboardingService: OnboardingService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      await ctx.reply('Open web app to manage onboarding flow.', {
        reply_markup: {
          inline_keyboard: Keyboards.onboardingManagementInline,
        },
      });
      await ctx.reply('Press "Back" when you finish', {
        reply_markup: {
          keyboard: Keyboards.onboardingManagement,
          resize_keyboard: true,
        },
      });
    } else {
      const step = await this.onboardingService.getOnboardingStep(
        ctx.message.from.id,
      );

      await ctx.reply('Welcome to the onboarding process!');

      if (step) {
        await ctx.reply(`${step.title}\n\n${step.link}`, {
          reply_markup: {
            keyboard: Keyboards.OnboardingEnter,
            resize_keyboard: true,
          },
        });
        await this.onboardingService.scheduleNotifications({
          telegramId: ctx.message.from.id,
          onboardingStep: step,
        });
      } else {
        await ctx.reply('No steps found');
        await ctx.scene.enter(Scenes.Start);
      }
    }
  }

  @Hears(Actions.Done)
  async done(@Ctx() ctx: SceneContext) {
    const step = await this.onboardingService.nextStep(ctx.message.from.id);

    if (step) {
      await ctx.reply(
        'Great! You have completed the step!\nHere is the next one:',
      );
      await ctx.reply(`${step.title}\n\n${step.link}`);
    } else {
      await ctx.reply('No steps found');
    }
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      await ctx.scene.enter(Scenes.Admin);
    } else {
      await ctx.scene.enter(Scenes.Start);
    }
  }
}
