import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { OnboardingService } from './services';
import { UpsertOnboardingDto } from './dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  getOnboardingItems() {
    return this.onboardingService.findAll();
  }

  @Post()
  upsertOnboardingItems(@Body(new ValidationPipe()) body: UpsertOnboardingDto) {
    return this.onboardingService.upsert(body.items);
  }

  @Delete('/:id')
  deleteOnboardingItem(@Param() id) {
    return this.onboardingService.delete(id);
  }
}
