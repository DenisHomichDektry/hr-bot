import { ExecutionContext, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';

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

  async validateUser(
    sceneContext: SceneContext,
    context: ExecutionContext,
  ): Promise<boolean> {
    const from = sceneContext.message?.from || sceneContext.callbackQuery?.from;
    const userRole = await this.getUserRole(from?.id);

    if (!from) {
      return await this.validateWebAppUser(context);
    }

    if (userRole && sceneContext.state) {
      sceneContext.state.role = userRole;
      return true;
    }

    return false;
  }

  async validateWebAppUser(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers.authorization;

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();
    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    if (!hash || !process.env.TELEGRAM_TOKEN || !dataCheckString) return false;

    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_TOKEN);

    const calculatedHash = crypto
      .createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');

    return hash === calculatedHash;
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
