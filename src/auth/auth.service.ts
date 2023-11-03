import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SceneContext } from 'src/types';
import { UserEntity } from 'src/user/entities/user.entity';

import { ICachedUsers } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private cachedUsers: ICachedUsers = {};

  async validateUser(sceneContext: SceneContext): Promise<boolean> {
    const from = sceneContext.message?.from || sceneContext.callbackQuery?.from;
    const userRole = await this.getUserRole(from?.id);

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

    const user = await this.userRepository.findOne({
      relations: ['role'],
      where: { telegramId },
    });

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
