import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, Actions } from 'src/constants';
import { FeedbackService } from 'src/feedback/feedback.service';

import * as Keyboards from './keyboards';
import { OnboardingService } from './onboarding.service';

@Scene(Scenes.Onboarding)
export class OnboardingScene {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    // ADMIN flow
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
      // USER FLOW
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
      } else {
        const feedbacks = await this.feedbackService.findUserFeedbacks({
          telegramId: ctx.from.id,
        });

        if (feedbacks.length) {
          await ctx.reply('You have already completed the onboarding process!');
          await ctx.scene.enter(Scenes.Start, ctx.session.__scenes.state);
        } else {
          await ctx.reply('No steps found');
          await ctx.scene.enter(Scenes.Feedback, ctx.session.__scenes.state);
        }
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
      await ctx.reply('You have completed the onboarding process!');
      await ctx.scene.enter(Scenes.Feedback, ctx.session.__scenes.state);
    }
  }

  @Hears(Actions.Assistance)
  async assistance(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(Scenes.Assistance, ctx.session.__scenes.state);
  }

  @Hears(Actions.Back)
  async leave(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      await ctx.scene.enter(Scenes.Admin, ctx.session.__scenes.state);
    } else {
      await ctx.scene.enter(Scenes.Start);
    }
  }
}
