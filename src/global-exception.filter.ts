import {
  ExceptionFilter,
  Catch,
  HttpException,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { SceneContext } from 'src/types';
import { Scenes } from 'src/constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, context: ExecutionContext) {
    if (exception?.getStatus?.() === 403) {
      return 'You are not authorized to access this resource';
    }
    if (process.env.ENV === 'development') console.log(exception);
    this.logger.error(exception);

    const sceneContext = context.getArgs()[0] as SceneContext;
    sceneContext.scene.enter(Scenes.Start);

    return 'Unknown error';
  }
}
