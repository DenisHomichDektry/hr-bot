import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UserService } from 'src/user/services/user.service';
import { SceneContext } from 'src/types';

import { ICachedUsers } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private cachedUsers: ICachedUsers = {};

  async validateUser(sceneContext: SceneContext): Promise<boolean> {
    const from = sceneContext.message?.from || sceneContext.callbackQuery?.from;
    const userRole = await this.getUserRole(from.id);

    if (userRole) {
      sceneContext.state.role = userRole;
      return true;
    }

    return false;
  }

  async getUserRole(telegramId: number) {
    if (this.cachedUsers.hasOwnProperty(telegramId)) {
      return this.cachedUsers[telegramId];
    }

    const user = await this.userService.findOne({ telegramId });

    if (user) {
      this.cachedUsers[telegramId] = user.role.name;
      return user.role.name;
    }

    this.cachedUsers[telegramId] = null;
    return null;
  }

  @Cron('0 */5 * * * *')
  clearCache() {
    console.log('clear cache');
    this.cachedUsers = {};
  }
}
