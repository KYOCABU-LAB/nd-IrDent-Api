import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

export class NumDocException extends BaseException {
  constructor(
    message: string = 'El NumDoc no es valido ',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      code ?? 'NUMDOC_EXCEPTION',
      extra,
      cause,
    );
  }
}

export class NumDocNotFoundException extends BaseException {
  constructor(
    message: string = 'El Numero de Documento no fue encontrado',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      code ?? 'NUMDOC_NOT_FOUND_EXCEPTION',
      extra,
      cause,
    );
  }
}

export class NumDocAlreadyExistsException extends BaseException {
  constructor(
    message: string = 'El Numero de Documento ya existe',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.CONFLICT,
      code ?? 'NUMDOC_ALREADY_EXISTS_EXCEPTION',
      extra,
      cause,
    );
  }
}
