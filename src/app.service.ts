import { Injectable } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';

import { Role } from 'src/auth/role.enum';
import { Actions } from 'src/constants';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}

  getHello(): string {
    return 'Hello World!';
  }

  startKeyboard(ctx: SceneContext) {
    const userRole = ctx.state.role;
    return userRole === Role.Admin
      ? [[{ text: Actions.KnowledgeBase }], [{ text: Actions.AdminPanel }]]
      : [[{ text: Actions.KnowledgeBase }], [{ text: Actions.Onboarding }]];
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
