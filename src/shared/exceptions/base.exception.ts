import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * clase personalizada para manjear excepciones HTTP
 * @extends HttpException
 * @constructor
 * @param {string} message - mensaje de error
 * @param {number} status - código de estado HTTP
 */
export class BaseException extends HttpException {
  constructor(
    message: string = 'Error interno',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      {
        statusCode: status,
        message,
        code,
        ...extra,
        cause: cause
          ? cause instanceof Error
            ? cause.message
            : cause
          : undefined,
      },
      status,
    );
  }
}
