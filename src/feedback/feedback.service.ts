import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/user/services/user.service';

import { FeedbackEntity } from './feedback.entity';
import { IFeedbackCreate, IUserFeedbacks } from './types';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<FeedbackEntity[]> {
    return await this.feedbackRepository.find({
      relations: ['user'],
      order: {
        user: {
          firstName: 'ASC',
        },
      },
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
}
