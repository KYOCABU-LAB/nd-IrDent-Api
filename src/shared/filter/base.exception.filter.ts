import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseException } from '../exceptions/base.exception';
import { Request, Response } from 'express';

/**
 * filtro personalizado para manejar excepciones BaseException
 * @implements ExceptionFilter
 * @constructor
 */
@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const res = exception.getResponse();

    const responseBody =
      typeof res === 'object' && res !== null ? res : { message: res };

    response.status(exception.getStatus()).json({
      ...responseBody,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}
