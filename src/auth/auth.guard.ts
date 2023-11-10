import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { SceneContext } from 'src/types';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const sceneContext = context.getArgs()[0] as SceneContext;

    return await this.authService.validateUser(sceneContext, context);
  }
}
