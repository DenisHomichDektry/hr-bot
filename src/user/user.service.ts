import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { GetUserDto } from 'src/user/dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(getUserDto: GetUserDto) {
    return this.userRepository.findOne({
      where: getUserDto,
      relations: ['role'],
    });
  }
}
