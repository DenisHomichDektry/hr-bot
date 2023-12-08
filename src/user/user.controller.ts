import {
  Controller,
  Get,
  ValidationPipe,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';

import { UserRoleService, UserService } from './services';
import { DeleteUserDto, GetUserDto, GetUsersDto, UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {}

  @Get()
  async getUsers(
    @Query(new ValidationPipe())
    query?: GetUsersDto,
  ) {
    return this.userService.findAll(query);
  }

  @Get('role')
  async getRoles() {
    return this.userRoleService.findAll();
  }

  @Get(':id')
  getUser(@Param(new ValidationPipe()) params: GetUserDto) {
    return this.userService.findOne(params);
  }

  @Patch()
  async updateUser(@Body(new ValidationPipe()) dto: UpdateUserDto) {
    return this.userService.update(dto);
  }

  @Delete(':id')
  removeUser(@Param(new ValidationPipe()) params: DeleteUserDto) {
    return this.userService.remove(params);
  }
}
