import {
  ExceptionFilter,
  Catch,
  HttpException,
  Inject,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpAdapterHost } from '@nestjs/core';

import { SceneContext } from 'src/types';
import { Scenes } from 'src/constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: HttpException, context: ExecutionContext) {
    const isWebApp = context.getType() === 'http';
    if (isWebApp) {
      console.log(exception);

      const { httpAdapter } = this.httpAdapterHost;
      const ctx = context.switchToHttp();

      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      httpAdapter.reply(
        ctx.getResponse(),
        exception?.getResponse?.(),
        httpStatus,
      );
      return;
    }

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
