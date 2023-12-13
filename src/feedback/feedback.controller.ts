import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

import { FeedbackService } from './feedback.service';

import { GetFeedbacksDto } from './dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  getFeedback(
    @Query(new ValidationPipe())
    query?: GetFeedbacksDto,
  ) {
    return this.feedbackService.findAll(query);
  }
}
