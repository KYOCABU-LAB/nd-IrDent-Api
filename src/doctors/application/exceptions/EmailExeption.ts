import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

export class EmailException extends BaseException {
  constructor(
    message: string = 'El email no es valido ',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      code ?? 'EMAIL_EXCEPTION',
      extra,
      cause,
    );
  }
}

export class EmailNotFoundException extends BaseException {
  constructor(
    message: string = 'El email no fue encontrado',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      code ?? 'EMAIL_NOT_FOUND_EXCEPTION',
      extra,
      cause,
    );
  }
}

export class EmailAlreadyExistsException extends BaseException {
  constructor(
    message: string = 'El email ya existe',
    code?: string | number,
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(
      message,
      HttpStatus.CONFLICT,
      code ?? 'EMAIL_ALREADY_EXISTS_EXCEPTION',
      extra,
      cause,
    );
  }
}
