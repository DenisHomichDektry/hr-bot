import { Injectable, HttpException } from '@nestjs/common';
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
  GetUsersDto,
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
      where: [{ id: getUserDto.id }, { telegramId: getUserDto.telegramId }],
      relations: ['role'],
    });
  }

  async findAll(dto?: GetUsersDto) {
    const take = dto?.limit || 5;
    const skip = dto?.page * dto?.limit || 0;
    return this.userRepository.findAndCount({
      relations: ['role'],
      order: {
        firstName: 'ASC',
      },
      take,
      skip,
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
      ...userDto,
      role: userRole,
    });

    const userEntity = await this.userRepository.save(user);
    this.authService.clearCache();
    return userEntity;
  }

  async remove(deleteDto: DeleteUserDto) {
    const user = await this.userRepository.findOne({ where: deleteDto });

    if (!user) {
      throw new HttpException('User not found', 404);
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
      throw new HttpException('User not found', 404);
    }

    if (updateUserDto.role) {
      const role = await this.useRoleService.findOne({
        name: updateUserDto.role,
      });
      if (role) {
        user.role = role;
      }
    }

    if (updateUserDto.roleId) {
      const role = await this.useRoleService.findOne({
        id: updateUserDto.roleId,
      });
      if (role) {
        user.role = role;
      }
    }

    const userEntity = await this.userRepository.save(
      this.userRepository.merge(user, { ...updateUserDto, role: user.role }),
    );
    this.authService.clearCache();

    return userEntity;
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
    const [users] = await this.findAll();

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
