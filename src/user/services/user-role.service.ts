import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRoleEntity } from '../entities/user-role.entity';
import { GetUserRoleDto } from '../dto/get-user-role.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async findOne(getUserRoleDto: GetUserRoleDto) {
    return this.userRoleRepository.findOne({
      where: getUserRoleDto,
    });
  }

  async findAll() {
    return this.userRoleRepository.find();
  }
}
