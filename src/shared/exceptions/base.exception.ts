import { HttpException } from '@nestjs/common';

/**
 * clase personalizada para manjear excepciones HTTP
 * @extends HttpException
 * @constructor
 * @param {string} message - mensaje de error
 * @param {number} status - código de estado HTTP
 */
export class BaseException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}
