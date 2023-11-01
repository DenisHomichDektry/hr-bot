import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OnboardingEntity } from './onboarding.entity';
import { GetOnboardingStepDto } from './dto';

@Injectable()
export class OnboardingService implements OnModuleInit {
  constructor(
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
  ) {}

  async onModuleInit() {
    console.log(await this.findOne({ order: 10 }));
  }

  async findAll(): Promise<OnboardingEntity[]> {
    return await this.onboardingRepository.find();
  }

  async findOne(dto: GetOnboardingStepDto): Promise<OnboardingEntity> {
    return await this.onboardingRepository.findOne({
      where: dto,
    });
  }
}
