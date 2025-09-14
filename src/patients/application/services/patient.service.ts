import { Injectable } from '@nestjs/common';
import { PatientRepository } from 'src/patients/domain/repositories/patient.interface';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
  ListPatientsQuery,
} from 'src/patients/application/dto/patient';
import {
  PatientAlreadyExistsException,
  PatientInvalidDataException,
  PatientNotFoundException,
} from '../exceptions/patient.exception';
import { PatientValidator } from 'src/patients/domain/validators/patient.validator';
import { EnumGenero, EnumTipoDocumento } from 'generated/prisma';

@Injectable()
export class PatientService {
  constructor(private readonly repo: PatientRepository) {}

  async create(data: CreatePatientDto): Promise<PatientResponseDto> {
    if (
      !PatientValidator.nombreRequerido(data.nombre) ||
      !PatientValidator.docValido(data.numero_documento, data.tipo_documento) ||
      !PatientValidator.isEmail(data.email) ||
      !PatientValidator.isTelefono(data.telefono) ||
      !PatientValidator.isFecha(data.fecha_nacimiento)
    ) {
      throw new PatientInvalidDataException('Revisa documento, email, teléfono y fecha.');
    }

    const exists = await this.repo.existsByDocumentoOrEmail(
      data.numero_documento,
      data.email,
    );
    if (exists) throw new PatientAlreadyExistsException();

    // defaults compatibles con tu schema
    data.tipo_documento ??= EnumTipoDocumento.DNI;
    data.genero ??= EnumGenero.OTRO;

    return this.repo.create(data);
  }

  async update(id: number, data: UpdatePatientDto): Promise<PatientResponseDto> {
    const found = await this.repo.findById(id);
    if (!found) throw new PatientNotFoundException();

    if (data.email && !PatientValidator.isEmail(data.email)) {
      throw new PatientInvalidDataException('Email inválido');
    }
    if (data.telefono && !PatientValidator.isTelefono(data.telefono)) {
      throw new PatientInvalidDataException('Teléfono inválido');
    }
    if (data.fecha_nacimiento && !PatientValidator.isFecha(data.fecha_nacimiento)) {
      throw new PatientInvalidDataException('Fecha de nacimiento inválida');
    }
    if (
      data.numero_documento &&
      !PatientValidator.docValido(data.numero_documento, data.tipo_documento)
    ) {
      throw new PatientInvalidDataException('Documento inválido');
    }

    if (
      (data.numero_documento && data.numero_documento !== found.numero_documento) ||
      (data.email && data.email !== found.email)
    ) {
      const dup = await this.repo.existsByDocumentoOrEmail(
        data.numero_documento ?? found.numero_documento,
        data.email ?? found.email,
        id,
      );
      if (dup) throw new PatientAlreadyExistsException();
    }

    return this.repo.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const found = await this.repo.findById(id);
    if (!found) throw new PatientNotFoundException();
    await this.repo.delete(id);
  }

  async clearAll(): Promise<number> {
    // operación destructiva
    return this.repo.clearAll();
  }

  async findById(id: number): Promise<PatientResponseDto> {
    const p = await this.repo.findById(id);
    if (!p) throw new PatientNotFoundException();
    return p;
  }

  async list(query: ListPatientsQuery) {
    const skip = Number(query?.skip ?? 0);
    const take = Math.min(Number(query?.take ?? 10), 100);
    const q = query?.q?.trim() || undefined;
    return this.repo.list({ skip, take, q });
  }
}
