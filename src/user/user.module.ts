import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserService } from './services/user.service';
import { UserScene } from './scenes/user.scene';
import { UserRoleService } from './services/user-role.service';
import { AddUserScene } from './scenes/add-user.scene';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  providers: [UserService, UserScene, UserRoleService, AddUserScene],
  exports: [UserService],
})
export class UserModule {}
