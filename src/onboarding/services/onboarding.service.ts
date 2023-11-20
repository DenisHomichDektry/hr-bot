import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { html } from 'telegram-format';

import { UserService } from 'src/user/services/user.service';
import { NotificationService } from 'src/notification/notification.service';

import { OnboardingEntity, OnboardingProgressEntity } from '../entities';
import { GetOnboardingStepDto, UpsertOnboardingItemDto } from '../dto';
import { OnboardingProgressService } from './onboarding-progress.service';
import { IScheduleNotifications } from '../types';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    @InjectRepository(OnboardingProgressEntity)
    private readonly onboardingProgressRepository: Repository<OnboardingProgressEntity>,
    private readonly onboardingProgressService: OnboardingProgressService,
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

  async getStepOnEnter(
    userTelegramId: number,
  ): Promise<OnboardingEntity | null> {
    const result = await this.onboardingProgressService.getLatestOnboardingStep(
      userTelegramId,
    );

    if (!result?.step) {
      result.progress =
        await this.onboardingProgressService.createFirstOnboardingProgress(
          userTelegramId,
        );
      result.step = result?.progress?.step;
    }

    if (!result?.step) return null;

    const existingNotifications = await this.notificationService.findAll({
      source: result.progress.id,
    });

    if (existingNotifications.length === 0) {
      await this.scheduleNotifications({
        oldOnboardingProgress: {} as OnboardingProgressEntity,
        newOnboardingProgress: result.progress,
      });
    }

    return result.step;
  }

  async nextStep(userTelegramId: number): Promise<OnboardingEntity | null> {
    const result = await this.onboardingProgressService.getLatestOnboardingStep(
      userTelegramId,
    );

    if (!result?.progress || !result?.step) return null;

    const updateResult =
      await this.onboardingProgressService.completeOnboardingStep(
        result.progress,
      );

    if (updateResult.affected !== 1) return null;

    const nextOnboardingStep = await this.findOne({
      order: result.step.order + 1,
    });

    if (!nextOnboardingStep) return null;

    const createdOnboardingProgress =
      await this.onboardingProgressService.create({
        telegramId: userTelegramId,
        onboardingStep: nextOnboardingStep,
      });

    if (!createdOnboardingProgress) return null;

    // schedule notifications
    await this.scheduleNotifications({
      oldOnboardingProgress: result.progress,
      newOnboardingProgress: createdOnboardingProgress,
    });

    return nextOnboardingStep;
  }

  async scheduleNotifications(dto: IScheduleNotifications) {
    const existingNotifications = await this.notificationService.findAll({
      source: dto.oldOnboardingProgress?.id,
    });

    if (existingNotifications.length) {
      await this.notificationService.remove(existingNotifications);
    }

    const step = dto.newOnboardingProgress.step;
    const user = dto.newOnboardingProgress.user;
    let latestNotificationTime = Date.now();
    for (let i = 0; i < step.notificationIntervals.length; i++) {
      const interval = step.notificationIntervals[i];

      if (i === step.notificationIntervals.length - 1) {
        const userName = user.firstName + ' ' + user.lastName;
        const text = `User ${html.escape(
          userName,
        )} has not completed the step "${step.title}" in time.`;

        await this.notificationService.create({
          user: step.reportTo,
          text,
          source: dto.newOnboardingProgress.id,
          sendAt: new Date(latestNotificationTime + interval).toISOString(),
        });
      } else {
        const text = `Hey! It's time to complete the step "${
          step.title
        }"\n\n${html.url('link', step.link)}`;

        await this.notificationService.create({
          user,
          text,
          source: dto.newOnboardingProgress.id,
          sendAt: new Date(latestNotificationTime + interval).toISOString(),
        });
      }

      latestNotificationTime += interval;
    }
  }

  getOnboardingStepText(step: OnboardingEntity): string {
    return `${step.title}\n\n${step.description}\n\n${html.url(
      'Link',
      step.link.trim(),
    )}`;
  }
}
