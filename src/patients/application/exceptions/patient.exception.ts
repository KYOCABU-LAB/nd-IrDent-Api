// patients/application/exceptions/patient.exception.ts
import { HttpStatus } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

export class PatientException extends BaseException {
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
  constructor(message = 'Paciente no encontrado') {
    super(message, HttpStatus.NOT_FOUND, 'PATIENT_NOT_FOUND');
  }
}

export class PatientAlreadyExistsException extends PatientException {
  constructor(message = 'Ya existe un paciente con ese documento o email') {
    super(message, HttpStatus.CONFLICT, 'PATIENT_ALREADY_EXISTS');
  }
}

export class PatientInvalidDataException extends PatientException {
  constructor(message = 'Datos inválidos para paciente') {
    super(message, HttpStatus.BAD_REQUEST, 'PATIENT_INVALID_DATA');
  }
}
