import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Excepción personalizada para indicar que un recurso ya existe.
 * Esta excepción se utiliza para manejar situaciones en las que se intenta crear un recurso
 * que ya está presente en el sistema, como un usuario o un producto con un identificador único.
 * Hereda de BaseException para mantener la consistencia en el manejo de excepciones.
 */
export class AlreadyExistsException extends BaseException {
  constructor();
  constructor(
    message: string,
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  );
  constructor(
    message: string = 'El recurso ya existe',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(message, HttpStatus.CONFLICT, code ?? 'ALREADY_EXISTS', extra, cause);
  }
}
