import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';

import { SceneContext } from 'src/types';
import { Scenes, feedbackRange } from 'src/constants';

import * as Keyboards from './keyboards';
import { FeedbackService } from './feedback.service';

@Scene(Scenes.Feedback)
export class FeedbackScene {
  constructor(private readonly feedbackService: FeedbackService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    if (ctx.session.__scenes.state.management) {
      const feedbacks = await this.feedbackService.viewFeedbacks();
      if (feedbacks.length === 0) {
        await ctx.reply('No feedbacks found!');
      }

      for (const feedback of feedbacks) {
        await ctx.reply(feedback);
      }
      await ctx.scene.enter(Scenes.Admin);
    } else {
      await ctx.reply('Please, leave feedback on Onboarding process.', {
        reply_markup: {
          keyboard: Keyboards.feedbackEnter,
        },
      });
    }
  }

  @Hears(feedbackRange)
  async leave(@Ctx() ctx: SceneContext) {
    await this.feedbackService.createAndNotify({
      telegramId: ctx.from.id,
      value: feedbackRange.indexOf(ctx.message.text),
    });

    await ctx.reply('Thank you for your feedback!');
    await ctx.scene.enter(Scenes.Start, ctx.session.__scenes.state);
  }
}
