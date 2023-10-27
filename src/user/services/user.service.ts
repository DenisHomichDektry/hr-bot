import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Actions } from 'src/constants';

import { UserEntity } from '../entities/user.entity';
import { GetUserDto } from '../dto/get-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRoleService } from './user-role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly useRoleService: UserRoleService,
  ) {}

  async findOne(getUserDto: GetUserDto) {
    return this.userRepository.findOne({
      where: getUserDto,
      relations: ['role'],
    });
  }

  async findAll() {
    return this.userRepository.find({
      relations: ['role'],
    });
  }

  async create(userDto: CreateUserDto) {
    // check if user already exists
    const userExists = await this.userRepository.findOne({
      where: { telegramId: userDto.telegramId },
    });
    if (userExists) {
      return null;
    }

    const userRole = await this.useRoleService.findOne({ name: 'user' });

    const user = this.userRepository.create({
      telegramId: userDto.telegramId,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      role: userRole,
    });
    return await this.userRepository.save(user);
  }

  async getUserRoleKeyboards() {
    const userRoles = await this.useRoleService.findAll();
    const keyboards = [[]];
    for (const userRole of userRoles) {
      keyboards[0].push({
        text: userRole.name,
      });
    }
    keyboards.push([
      {
        text: Actions.Back,
      },
    ]);
    return keyboards;
  }
}
