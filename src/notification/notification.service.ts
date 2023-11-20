import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Cron } from '@nestjs/schedule';
import { InlineKeyboardMarkup } from '@telegraf/types/markup';

import { UserService } from 'src/user/services/user.service';
import { OnboardingEntity } from 'src/onboarding/entities/onboarding.entity';
import { SceneContext } from 'src/types';
import { UserEntity } from 'src/user/entities/user.entity';

import { NotificationEntity } from './notification.entity';
import { IGetNotification, TNotificationCreate } from './types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly userService: UserService,
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    @InjectBot() private bot: Telegraf<SceneContext>,
  ) {}

  async create(dto: TNotificationCreate) {
    let user: UserEntity;

    if ('telegramId' in dto) {
      user = await this.userService.findOne({
        telegramId: dto.telegramId,
      });
    }

    if ('user' in dto) {
      user = dto.user;
    }

    if (!user) {
      return null;
    }

    const notification = this.notificationRepository.create({
      ...dto,
      user,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(dto?: IGetNotification) {
    return await this.notificationRepository.find({
      relations: ['user'],
      where: {
        source: dto?.source,
      },
    });
  }

  async remove(
    notification: NotificationEntity | NotificationEntity[],
  ): Promise<NotificationEntity | NotificationEntity[]> {
    return await this.notificationRepository.remove(
      notification as NotificationEntity[],
    );
  }

  async sendNotification(
    telegramId: number,
    text: string,
    replyMarkup?: InlineKeyboardMarkup,
  ) {
    await this.bot.telegram.sendMessage(telegramId, text, {
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    });
  }

  @Cron('*/60 * * * * *')
  async sendNotifications() {
    console.log('check notifications');
    const notifications = await this.findAll();

    if (!notifications.length) {
      return;
    }

    notifications.forEach((notification) => {
      const { sendAt } = notification;

      if (new Date(sendAt).getTime() < Date.now()) {
        this.sendNotification(notification.user.telegramId, notification.text);
        this.remove(notification);
      }
    });
  }
}
