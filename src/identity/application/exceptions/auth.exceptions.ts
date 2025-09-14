import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción para cuando un usuario no existe
 */
export class UserNotFoundException extends HttpException {
  constructor(message: string = 'Usuario no encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

/**
 * Excepción para cuando la contraseña es incorrecta
 */
export class InvalidPasswordException extends HttpException {
  constructor(message: string = 'Contraseña incorrecta') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}