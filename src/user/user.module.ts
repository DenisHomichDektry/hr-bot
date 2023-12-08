import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserService } from './services/user.service';
import { UserRoleService } from './services/user-role.service';
import {
  AddUserScene,
  EditUserScene,
  RemoveUserScene,
  UserScene,
} from './scenes';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity]), AuthModule],
  providers: [
    UserService,
    UserScene,
    UserRoleService,
    AddUserScene,
    RemoveUserScene,
    EditUserScene,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
