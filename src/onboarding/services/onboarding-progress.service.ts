import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';

import { OnboardingEntity, OnboardingProgressEntity } from '../entities';
import { IOnboardingProgressCreate } from '../types';

@Injectable()
export class OnboardingProgressService {
  constructor(
    @InjectRepository(OnboardingProgressEntity)
    private readonly onboardingProgressRepository: Repository<OnboardingProgressEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OnboardingEntity)
    private readonly onboardingStepRepository: Repository<OnboardingEntity>,
  ) {}

  async create(
    onboardingProgress: IOnboardingProgressCreate,
  ): Promise<OnboardingProgressEntity> {
    const { userId, telegramId, user, onboardingStep, onboardingStepId } =
      onboardingProgress;
    let userEntity: UserEntity;
    if ((userId || telegramId) && !user) {
      userEntity = await this.userRepository.findOne({
        where: [
          {
            id: userId,
          },
          {
            telegramId: telegramId,
          },
        ],
      });
    } else {
      userEntity = user;
    }

    if (!userEntity) {
      return null;
    }

    let onboardingStepEntity: OnboardingEntity;
    if (onboardingStepId && !onboardingStep) {
      onboardingStepEntity = await this.onboardingStepRepository.findOne({
        where: {
          id: onboardingStepId,
        },
      });
    } else {
      onboardingStepEntity = onboardingStep;
    }

    if (!onboardingStepEntity) {
      return null;
    }

    const newOnboardingProgress = this.onboardingProgressRepository.create({
      user: userEntity,
      step: onboardingStepEntity,
    });

    return await this.onboardingProgressRepository.save(newOnboardingProgress);
  }

  async update(
    entity: Partial<OnboardingProgressEntity>,
  ): Promise<UpdateResult> {
    return await this.onboardingProgressRepository.update(entity.id, entity);
  }

  async getLatestOnboardingStep(userTelegramId: number): Promise<{
    step: OnboardingEntity | null;
    progress: OnboardingProgressEntity | null;
  }> {
    const onboardingProgressArr = await this.onboardingProgressRepository.find({
      relations: ['step', 'user', 'step.reportTo'],
      where: {
        user: {
          telegramId: userTelegramId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const result = {
      step: null,
      progress: null,
    };

    if (onboardingProgressArr?.length) {
      result.progress = onboardingProgressArr[0];
      result.step = result.progress.step;

      return result;
    }

    if (onboardingProgressArr?.length === 0) {
      result.progress = await this.createFirstOnboardingProgress(
        userTelegramId,
      );
      result.step = result.progress.step;
      return result;
    }

    return result;
  }

  async createFirstOnboardingProgress(
    userTelegramId: number,
  ): Promise<OnboardingProgressEntity | null> {
    const onboardingEntities = await this.onboardingStepRepository.find({
      order: {
        order: 'ASC',
      },
    });

    const firstOnboardingStep = onboardingEntities?.[0];

    if (!firstOnboardingStep) {
      return null;
    }

    return await this.create({
      telegramId: userTelegramId,
      onboardingStep: firstOnboardingStep,
    });
  }

  async completeOnboardingStep(
    entity: Partial<OnboardingProgressEntity>,
  ): Promise<UpdateResult> {
    return await this.update({
      ...entity,
      completedAt: new Date().toISOString(),
    });
  }
}
