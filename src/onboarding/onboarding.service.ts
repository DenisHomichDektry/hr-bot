import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

import { UserService } from 'src/user/services/user.service';
import { NotificationService } from 'src/notification/notification.service';

import { OnboardingEntity } from './onboarding.entity';
import {
  ScheduleNotificationsDto,
  GetOnboardingStepDto,
  UpsertOnboardingItemDto,
} from './dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(): Promise<OnboardingEntity[]> {
    return await this.onboardingRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  async findOne(dto: GetOnboardingStepDto): Promise<OnboardingEntity> {
    return await this.onboardingRepository.findOne({
      relations: ['reportTo'],
      where: dto,
    });
  }

  async upsert(items: UpsertOnboardingItemDto[]): Promise<InsertResult> {
    return await this.onboardingRepository.upsert(items, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
      upsertType: 'on-conflict-do-update',
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    await this.onboardingRepository.delete(id);
    const items = await this.findAll();
    items.forEach((item, index) => {
      item.order = index;
    });
    return await this.upsert(items);
  }

  async getOnboardingStep(userTelegramId: number) {
    const user = await this.userService.findOne({
      telegramId: userTelegramId,
    });

    if (!user) {
      return null;
    }

    const order = user.onboardingStep !== null ? user.onboardingStep : 0;

    if (user.onboardingStep === null) {
      const updatedUser = await this.userService.update({
        id: user.id,
        onboardingStep: order,
      });

      if (!updatedUser) {
        return null;
      }
    }

    return await this.findOne({
      order,
    });
  }

  async nextStep(userTelegramId: number) {
    const user = await this.userService.findOne({ telegramId: userTelegramId });

    if (!user) {
      return null;
    }
    user.onboardingStep = user.onboardingStep ? user.onboardingStep + 1 : 1;

    const updatedUser = await this.userService.update({
      id: user.id,
      onboardingStep: user.onboardingStep,
    });

    if (!updatedUser) {
      return null;
    }

    const onboardingStep = await this.getOnboardingStep(userTelegramId);

    if (!onboardingStep) {
      const existingNotifications = await this.notificationService.findAll({
        telegramId: userTelegramId,
      });
      await this.notificationService.remove(existingNotifications);
      const onboardingStep = await this.findOne({});
      const { firstName, lastName, username } = user;
      const text = `User [${
        firstName + ' ' + lastName
      }](https://t.me/${username}) has completed the onboarding process\\!`;

      await this.notificationService.sendNotification(
        onboardingStep.reportTo.telegramId,
        text,
      );
      return null;
    }

    await this.scheduleNotifications({
      userId: user.id,
      onboardingStep,
    });

    return onboardingStep;
  }

  async scheduleNotifications(dto: ScheduleNotificationsDto) {
    const existingNotifications = await this.notificationService.findAll({
      userId: dto.userId,
      telegramId: dto.telegramId,
    });

    if (
      existingNotifications.length &&
      (existingNotifications[0].user.id !== dto.onboardingStep.id ||
        existingNotifications[0].user.telegramId !== dto.telegramId)
    ) {
      await this.notificationService.remove(existingNotifications);
    }

    let latestNotificationTime = Date.now();
    for (const interval of dto.onboardingStep.notificationIntervals) {
      await this.notificationService.create({
        userId: dto.userId,
        telegramId: dto.telegramId,
        onboardingStepId: dto.onboardingStep.id,
        sendAt: new Date(latestNotificationTime + interval).toISOString(),
      });
      latestNotificationTime += interval;
    }
  }
}
