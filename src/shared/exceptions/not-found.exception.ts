import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Excepción personalizada para manejar errores de "Recurso no encontrado".
 * Esta excepción se utiliza para indicar que un recurso solicitado no se encuentra disponible.
 * Hereda de BaseException para proporcionar un manejo de errores consistente en la aplicación.
 */
export class NotFoundException extends BaseException {
  constructor();

  constructor(
    message: string,
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  );

  constructor(
    message: string = 'Recurso no encontrado',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(message, HttpStatus.NOT_FOUND, code ?? 'NOT_FOUND', extra, cause);
  }
}
