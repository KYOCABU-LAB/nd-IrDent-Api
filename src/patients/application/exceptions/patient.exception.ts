import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

export class PatientException extends BaseException {
/**
 * Constructor for PatientException
 * @param {string} [message='Error en pacientes'] - Mensaje de error
 * @param {number} [status=HttpStatus.BAD_REQUEST] - Código de estado HTTP
 * @param {string|number} [code='PATIENT_EXCEPTION'] - Código de error
 * @param {Record<string, any>} [extra] - Información adicional
 * @param {any} [cause] - Causa de la excepción
 */
  constructor(
    message = 'Error en pacientes',
    status = HttpStatus.BAD_REQUEST,
    code: string | number = 'PATIENT_EXCEPTION',
    extra?: Record<string, any>,
    cause?: any,
  ) {
    super(message, status, code, extra, cause);
  }
}

export class PatientNotFoundException extends PatientException {
  /**
   * Constructor for PatientNotFoundException
   * @param {string} message - Mensaje de error, por defecto 'Paciente no encontrado'
   */
  constructor(message = 'Paciente no encontrado') {
    super(message, HttpStatus.NOT_FOUND, 'PATIENT_NOT_FOUND');
  }
}

export class PatientAlreadyExistsException extends PatientException {
  /**
   * Constructor for PatientAlreadyExistsException
   * @param {string} message - Mensaje de error, por defecto 'Ya existe un paciente con ese documento o email'
   */
  constructor(message = 'Ya existe un paciente con ese documento o email') {
    super(message, HttpStatus.CONFLICT, 'PATIENT_ALREADY_EXISTS');
  }
}

export class PatientInvalidDataException extends PatientException {
/**
 * Constructor for PatientInvalidDataException
 * @param {string} message - Mensaje de error, por defecto 'Datos inválidos para paciente'
 */
  constructor(message = 'Datos inválidos para paciente') {
    super(message, HttpStatus.BAD_REQUEST, 'PATIENT_INVALID_DATA');
  }
}
