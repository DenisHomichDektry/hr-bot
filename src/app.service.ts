import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { Actions } from 'src/constants';

import { SceneContext } from './types';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  startKeyboard(ctx: SceneContext) {
    const userRole = ctx.state.role;
    return userRole === Role.Admin
      ? [[{ text: Actions.KnowledgeBase }], [{ text: Actions.AdminPanel }]]
      : [[{ text: Actions.KnowledgeBase }], [{ text: Actions.Onboarding }]];
  }
}
