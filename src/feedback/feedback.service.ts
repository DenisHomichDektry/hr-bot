import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/user/services/user.service';

import { FeedbackEntity } from './feedback.entity';
import { IFeedbackCreate } from './types';

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

  async create(feedback: IFeedbackCreate): Promise<FeedbackEntity> {
    const user = await this.userService.findOne({
      telegramId: 'telegramId' in feedback && feedback.telegramId,
      id: 'userId' in feedback && feedback.userId,
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
