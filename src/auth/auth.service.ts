import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

import { SceneContext } from 'src/types';
import { UserEntity } from 'src/user/entities/user.entity';

import { ICachedUsers, IGoogleUser, IJwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
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
    try {
      const request = context.switchToHttp().getRequest();
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
          role: {
            name: 'admin',
          },
        },
        relations: ['role'],
      });

      return !!user;
    } catch (e) {
      console.log(e);
      return false;
    }
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

  generateJwt(payload: IJwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async signIn(user: IGoogleUser): Promise<string | null> {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.userRepository.findOne({
      where: { email: user.email, role: { name: 'admin' } },
      relations: ['role'],
    });

    if (!userExists) {
      return null;
    }

    await this.updateImage(user, userExists);

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async updateImage(user: IGoogleUser, userExists: UserEntity) {
    if (userExists.imgUrl !== user.picture) {
      await this.userRepository.update(
        { email: user.email },
        { imgUrl: user.picture },
      );
    }
  }
}
