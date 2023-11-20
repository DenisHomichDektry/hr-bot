import { Injectable } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';

import { Role } from 'src/auth/role.enum';
import { Actions } from 'src/constants';
import { UserService } from 'src/user/services/user.service';
import { OnboardingProgressService } from 'src/onboarding/services';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly onboardingProgressService: OnboardingProgressService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async startKeyboard(ctx: SceneContext) {
    const userRole = ctx.state.role;

    if (userRole === Role.Admin) {
      return [
        [{ text: Actions.KnowledgeBase }],
        [{ text: Actions.AdminPanel }],
      ];
    } else {
      const { progress } =
        await this.onboardingProgressService.getLatestOnboardingStep(
          ctx.from.id,
        );
      const isOnboardingCompleted = !!progress?.completedAt;

      return isOnboardingCompleted
        ? [[{ text: Actions.KnowledgeBase }]]
        : [[{ text: Actions.KnowledgeBase }], [{ text: Actions.Onboarding }]];
    }
  }

  async updateUsername(user: { telegramId: number; username: string }) {
    const userEntity = await this.userService.findOne({
      telegramId: user.telegramId,
    });

    if (!userEntity || userEntity.username === user.username) {
      return;
    }

    this.userService.update({ id: userEntity.id, username: user.username });
  }
}
