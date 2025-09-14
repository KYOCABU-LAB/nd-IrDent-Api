import { Injectable } from '@nestjs/common';
import { PatientRepository } from 'src/patients/domain/repositories/patient.interface';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';
import {
  PatientAlreadyExistsException,
  PatientInvalidDataException,
  PatientNotFoundException,
} from '../exceptions/patient.exception';
import { PatientValidator } from 'src/patients/domain/validators/patient.validator';
import { EnumGenero, EnumTipoDocumento } from 'generated/prisma';
import {PaginationFilters} from 'src/shared/types/paginated.interface';

@Injectable()
export class PatientService {
  constructor(private readonly repo: PatientRepository) {}

  /**
   * Crea un paciente
   * @throws {PatientInvalidDataException} si los datos proporcionados no son válidos
   * @throws {PatientAlreadyExistsException} si el paciente ya existe
   * @param {CreatePatientDto} data - datos del paciente a crear
   * @returns {Promise<PatientResponseDto>} - paciente creado
   */
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

  /**
   * Actualiza un paciente existente
   * @throws {PatientNotFoundException} si no se encuentra el paciente con el id proporcionado
   * @throws {PatientInvalidDataException} si los datos proporcionados no son válidos
   * @throws {PatientAlreadyExistsException} si el paciente con los datos proporcionados ya existe
   * @param {number} id - id del paciente a actualizar
   * @param {UpdatePatientDto} data - datos del paciente a actualizar
   * @returns {Promise<PatientResponseDto>} - paciente actualizado
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
   * Elimina un paciente
   * @throws {PatientNotFoundException} si el paciente con el id proporcionado no existe
   * @param {number} id - id del paciente a eliminar
   */
  async delete(id: number): Promise<void> {
    const found = await this.repo.findById(id);
    if (!found) throw new PatientNotFoundException();
    await this.repo.delete(id);
  }

  /**
   * Elimina todos los pacientes de la base de datos
   * @returns {Promise<number>} - número de pacientes eliminados
   */
  async clearAll(): Promise<number> {
    // operación destructiva
    return this.repo.clearAll();
  }

  /**
   * Busca un paciente por su id
   * @throws {PatientNotFoundException} si el paciente con el id proporcionado no existe
   * @param {number} id - id del paciente a buscar
   * @returns {Promise<PatientResponseDto>} - paciente encontrado
   */
  async findById(id: number): Promise<PatientResponseDto> {
    const p = await this.repo.findById(id);
    if (!p) throw new PatientNotFoundException();
    return p;
  }

/**
 * Obtiene una lista de pacientes
 * @param {ListPatientsQuery} query - objeto que contiene los parámetros de búsqueda
 * @returns {Promise<{ data: PatientResponseDto[]; total: number }>} - lista de pacientes encontrados
 */
  async list(query: PaginationFilters) {
    const skip = Number(query?.page ?? 0);
    const take = Math.min(Number(query?.size ?? 10), 100);
    return this.repo.list({ skip, take });
  }
}
