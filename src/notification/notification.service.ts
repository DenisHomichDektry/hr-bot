import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Cron } from '@nestjs/schedule';

import { UserService } from 'src/user/services/user.service';
import { OnboardingEntity } from 'src/onboarding/onboarding.entity';
import { SceneContext } from 'src/types';

import { NotificationEntity } from './notification.entity';
import { CreateNotificationDto, GetNotificationDto } from './dto';

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

  async create(dto: CreateNotificationDto) {
    const user = await this.userService.findOne({
      id: dto.userId,
      telegramId: dto.telegramId,
    });

    if (!user) {
      return null;
    }

    const onboardingStep = await this.onboardingRepository.findOne({
      where: { id: dto.onboardingStepId },
    });

    if (!onboardingStep) {
      return null;
    }

    const notification = this.notificationRepository.create({
      ...dto,
      user,
      onboardingStep,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(dto?: GetNotificationDto) {
    const where = [];

    if (dto?.userId) where.push({ user: { id: dto.userId } });
    if (dto?.telegramId) where.push({ user: { telegramId: dto.telegramId } });
    if (dto?.onboardingStepId) {
      where.push({ onboardingStep: { id: dto.onboardingStepId } });
    }

    return await this.notificationRepository.find({
      relations: ['user', 'onboardingStep'],
      where,
    });
  }

  async remove(
    notification: NotificationEntity | NotificationEntity[],
  ): Promise<NotificationEntity | NotificationEntity[]> {
    return await this.notificationRepository.remove(
      notification as NotificationEntity[],
    );
  }

  sendNotification(notification: NotificationEntity) {
    this.bot.telegram.sendMessage(
      notification.user.telegramId,
      `Hey! It's time to complete the step "${notification.onboardingStep.title}"\n\n${notification.onboardingStep.link}`,
    );
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
        this.sendNotification(notification);
        this.remove(notification);
      }
    });
  }
}
