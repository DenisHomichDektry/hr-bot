import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Actions } from 'src/constants';
import { AuthService } from 'src/auth/auth.service';

import { UserEntity } from '../entities/user.entity';
import { UserRoleService } from './user-role.service';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserDto,
  UpdateUserDto,
} from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly useRoleService: UserRoleService,
    private readonly authService: AuthService,
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

    const userRole = await this.useRoleService.findOne({ name: userDto.role });

    const user = this.userRepository.create({
      telegramId: userDto.telegramId,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      role: userRole,
    });

    const userEntity = await this.userRepository.save(user);
    this.authService.clearCache();
    return userEntity;
  }

  async remove(deleteDto: DeleteUserDto) {
    const user = await this.userRepository.findOne({ where: deleteDto });

    if (!user) {
      return null;
    }

    const deletedEntity = await this.userRepository.remove(user);
    this.authService.clearCache();
    return deletedEntity;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
      relations: ['role'],
    });

    if (!user) {
      return null;
    }

    if (updateUserDto.role) {
      const role = await this.useRoleService.findOne({
        name: updateUserDto.role,
      });
      if (role) {
        user.role = role;
      }
    }

    return await this.userRepository.save(
      this.userRepository.merge(user, { ...updateUserDto, role: user.role }),
    );
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

  async viewUsers() {
    const users = await this.findAll();

    return users.map((user) => {
      return {
        text:
          user.firstName + ' ' + user.lastName + '\nRole: ' + user.role.name,
        args: {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: Actions.Edit,
                  callback_data: Actions.Edit + 'user|' + user.id,
                },
                {
                  text: Actions.Remove,
                  callback_data: Actions.Remove + 'user|' + user.id,
                },
              ],
            ],
          },
        },
      };
    });
  }
}
