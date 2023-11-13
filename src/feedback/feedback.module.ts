import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';

import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackScene } from './feedback.scene';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity]), UserModule],
  providers: [FeedbackService, FeedbackScene],
  exports: [FeedbackService],
})
export class FeedbackModule {}
