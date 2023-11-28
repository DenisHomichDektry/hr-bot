import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

import { UserEntity } from 'src/user/entities/user.entity';

import { AuthGuard } from './guards';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // TODO: change expiresIn to 1d
      signOptions: { expiresIn: 1200 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService, GoogleStrategy],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
