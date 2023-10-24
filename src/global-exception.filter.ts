import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    if (exception?.getStatus?.() === 403) {
      return 'You are not authorized to access this resource';
    }
    console.log(exception);
    return 'Unknown error';
  }
}
