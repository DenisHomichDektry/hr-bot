import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/user/services/user.service';
import { feedbackRange } from 'src/constants';
import { NotificationService } from 'src/notification/notification.service';
import { OnboardingEntity } from 'src/onboarding/entities/onboarding.entity';

import { FeedbackEntity } from './feedback.entity';
import {
  IFeedbackCreate,
  IFeedbackCreateTelegramId,
  IUserFeedbacks,
} from './types';
import { GetFeedbacksDto } from './dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(dto?: GetFeedbacksDto): Promise<[FeedbackEntity[], number]> {
    const take = dto?.limit || 5;
    const skip = dto?.page * dto?.limit || 0;
    return await this.feedbackRepository.findAndCount({
      relations: ['user'],
      order: {
        user: {
          firstName: 'ASC',
        },
      },
      take,
      skip,
    });
  }

  async findUserFeedbacks(user: IUserFeedbacks): Promise<FeedbackEntity[]> {
    return await this.feedbackRepository.find({
      relations: ['user'],
      where: [
        {
          user: {
            id: 'userId' in user ? user.userId : null,
          },
        },
        {
          user: {
            telegramId: 'telegramId' in user ? user.telegramId : null,
          },
        },
      ],
      order: {
        user: {
          firstName: 'ASC',
        },
      },
    });
  }

  async create(feedback: IFeedbackCreate): Promise<FeedbackEntity> {
    const user = await this.userService.findOne({
      telegramId: 'telegramId' in feedback ? feedback.telegramId : null,
      id: 'userId' in feedback ? feedback.userId : null,
    });

    if (!user) {
      return null;
    }

    const feedbackEntity = this.feedbackRepository.create({
      ...feedback,
      user,
    });

    return await this.feedbackRepository.save(feedbackEntity);
  }

  async viewFeedbacks() {
    const [feedbacks] = await this.findAll();

    return feedbacks.map((feedback) => {
      return (
        feedback.user.firstName +
        ' ' +
        feedback.user.lastName +
        '\n\n' +
        feedbackRange[feedback.value]
      );
    });
  }

  async createAndNotify(feedback: IFeedbackCreateTelegramId) {
    const feedbackEntity = await this.create(feedback);

    if (!feedbackEntity) {
      return null;
    }

    const user = await this.userService.findOne({
      telegramId: feedback.telegramId,
    });

    if (!user) {
      return null;
    }

    const onboardingStep = await this.onboardingRepository.findOne({
      where: {
        order: 0,
      },
      relations: ['reportTo'],
    });
    const { firstName, lastName, username } = user;
    const text = `User [${
      firstName + ' ' + lastName
    }](https://t.me/${username}) has completed the onboarding process\\!`;

    await this.notificationService.sendNotification(
      onboardingStep.reportTo.telegramId,
      text,
    );

    return feedbackEntity;
  }
}
