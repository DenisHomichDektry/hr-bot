import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from 'src/user/services/user.service';
import { NotificationService } from 'src/notification/notification.service';

import { OnboardingEntity } from './onboarding.entity';
import { ScheduleNotificationsDto, GetOnboardingStepDto } from './dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(): Promise<OnboardingEntity[]> {
    return await this.onboardingRepository.find();
  }

  async findOne(dto: GetOnboardingStepDto): Promise<OnboardingEntity> {
    return await this.onboardingRepository.findOne({
      where: dto,
    });
  }

  async getOnboardingStep(userTelegramId: number) {
    const user = await this.userService.findOne({ telegramId: userTelegramId });

    if (!user) {
      return null;
    }

    return await this.findOne({
      order: user.onboardingStep >= 0 ? user.onboardingStep : 0,
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
        onboardingStepId: dto.onboardingStep.id,
        sendAt: new Date(latestNotificationTime + interval).toISOString(),
      });
      latestNotificationTime += interval;
    }
  }
}
