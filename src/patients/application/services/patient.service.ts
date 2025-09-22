import { Injectable } from '@nestjs/common';
import { PatientRepository } from 'src/patients/domain/repositories/patient.interface';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
  CreatePatientWithRelationsDto,
} from 'src/patients/application/dto/patient';
import type { CreateContactDto, UpdateContactDto } from 'src/patients/application/dto/contact.dto';
import type { CreateAddressDto, UpdateAddressDto } from 'src/patients/application/dto/address.dto';
import {
  PatientAlreadyExistsException,
  PatientInvalidDataException,
  PatientNotFoundException,
} from '../exceptions/patient.exception';
import { PatientValidator } from 'src/patients/domain/validators/patient.validator';
import { EnumGenero, EnumTipoDocumento } from 'generated/prisma';
import type { PatientListQuery } from 'src/patients/application/dto/patient.list.types';

@Injectable()
export class PatientService {
  constructor(private readonly repo: PatientRepository) {}

  /**
   * Crea un paciente en la base de datos.
   * @param data - datos del paciente a crear.
   * @returns - promesa que se resuelve con el paciente creado.
   * @throws PatientInvalidDataException - si los datos del paciente son inválidos.
   * @throws PatientAlreadyExistsException - si el paciente ya existe en la base de datos.
   */
  async create(data: CreatePatientWithRelationsDto): Promise<PatientResponseDto> {
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

    data.tipo_documento ??= EnumTipoDocumento.DNI;
    data.genero ??= EnumGenero.OTRO;

    // podrías validar aquí contactos/direcciones si quieres (teléfono requerido, etc.)
    return this.repo.create(data);
  }

  /**
   * Actualiza un paciente en la base de datos.
   * @param id - identificador único del paciente a actualizar.
   * @param data - datos del paciente a actualizar.
   * @returns - promesa que se resuelve con el paciente actualizado.
   * @throws PatientNotFoundException - si el paciente no existe en la base de datos.
   * @throws PatientInvalidDataException - si los datos del paciente son inválidos.
   * @throws PatientAlreadyExistsException - si el paciente ya existe en la base de datos.
   */
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

  /**
   * Elimina un paciente por su id
   * @param {number} id - id del paciente a eliminar
   * @returns - promesa que se resuelve con void
   * @throws PatientNotFoundException - si el paciente no existe en la base de datos
   */
  async delete(id: number): Promise<void> {
    const found = await this.repo.findById(id);
    if (!found) throw new PatientNotFoundException();
    await this.repo.delete(id);
  }

  /**
   * Elimina todos los pacientes de la base de datos.
   * @returns - promesa que se resuelve con el número de pacientes eliminados.
   */
  async clearAll(): Promise<number> {
    return this.repo.clearAll();
  }

  /**
   * Obtiene un paciente por su id
   * @param {number} id - id del paciente a buscar
   * @returns - promesa que se resuelve con el paciente encontrado
   * @throws PatientNotFoundException - si el paciente no existe en la base de datos
   */
  async findById(id: number): Promise<PatientResponseDto> {
    const p = await this.repo.findById(id);
    if (!p) throw new PatientNotFoundException();
    return p;
  }

  /**
   * Obtiene una lista de pacientes paginados
   * @param {PatientListQuery} query - objeto que contiene los parámetros de búsqueda
   * @returns - promesa que se resuelve con la lista de pacientes encontrados
   */
   async list(query: PatientListQuery) {
    const page = Math.max(1, Number(query?.page ?? 1));
    const size = Math.min(Number(query?.size ?? 10), 100);
    const skip = (page - 1) * size;
    const take = size;

    return this.repo.list({
      skip,
      take,
      filters: query?.filters,
    });
  }

   async addContact(pacienteId: number, data: CreateContactDto) {
    if (!PatientValidator.isTelefono(data.telefono)) {
      throw new PatientInvalidDataException('Teléfono inválido');
    }
    await this.repo.addContact(pacienteId, data);
    return { ok: true };
  }

  async updateContact(pacienteId: number, contactoId: number, data: UpdateContactDto) {
    if (data.telefono && !PatientValidator.isTelefono(data.telefono)) {
      throw new PatientInvalidDataException('Teléfono inválido');
    }
    await this.repo.updateContact(pacienteId, contactoId, data);
    return { ok: true };
  }

  async deleteContact(pacienteId: number, contactoId: number) {
    await this.repo.deleteContact(pacienteId, contactoId);
    return { ok: true };
  }

  async addAddress(pacienteId: number, data: CreateAddressDto) {
    await this.repo.addAddress(pacienteId, data);
    return { ok: true };
  }

  async updateAddress(pacienteId: number, direccionId: number, data: UpdateAddressDto) {
    await this.repo.updateAddress(pacienteId, direccionId, data);
    return { ok: true };
  }

  async deleteAddress(pacienteId: number, direccionId: number) {
    await this.repo.deleteAddress(pacienteId, direccionId);
    return { ok: true };
  }
}
