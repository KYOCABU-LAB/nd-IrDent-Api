import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
  CreatePatientWithRelationsDto,
} from 'src/patients/application/dto/patient';
import type { CreateContactDto, UpdateContactDto } from 'src/patients/application/dto/contact.dto';
import type { CreateAddressDto, UpdateAddressDto } from 'src/patients/application/dto/address.dto';

export type PatientListFilters = {
  nombre?: string;
  numero_documento?: string;
  email?: string;
};

export abstract class PatientRepository {
  abstract create(data: CreatePatientWithRelationsDto): Promise<PatientResponseDto>;
  abstract update(id: number, data: UpdatePatientDto): Promise<PatientResponseDto>;
  abstract delete(id: number): Promise<void>;
  abstract clearAll(): Promise<number>; 
  abstract findById(id: number): Promise<PatientResponseDto | null>;
  /**
   * Comprueba si ya existe un paciente con el numero de documento o email proporcionado
   * @param {string} numero_documento - numero de documento del paciente a buscar
   * @param {string} email - email del paciente a buscar
   * @param {number} [excludeId] - id del paciente a excluir de la búsqueda
   * @returns {Promise<boolean>} - true si el paciente existe, false en caso contrario
   */
  abstract existsByDocumentoOrEmail(
    numero_documento: string,   
    email: string,
    excludeId?: number,
  ): Promise<boolean>;
  /**
   * Obtiene una lista de pacientes
   * @param {Object} params - objeto que contiene los parámetros de búsqueda
   * @param {number} params.skip - número de pacientes a saltar
   * @param {number} params.take - número de pacientes a obtener
   * @param {string} [params.q] - texto a buscar en los pacientes
   * @returns {Promise<{ data: PatientResponseDto[]; total: number }>} - lista de pacientes encontrados
   */
  abstract list(params: {
    skip: number;
    take: number;
    filters?: PatientListFilters;
  }): Promise<{
    data: PatientResponseDto[];
    total: number;
  }>;


  abstract addContact(pacienteId: number, data: CreateContactDto): Promise<void>;
  abstract updateContact(pacienteId: number, contactoId: number, data: UpdateContactDto): Promise<void>;
  abstract deleteContact(pacienteId: number, contactoId: number): Promise<void>;
  
  abstract addAddress(pacienteId: number, data: CreateAddressDto): Promise<void>;
  abstract updateAddress(pacienteId: number, direccionId: number, data: UpdateAddressDto): Promise<void>;
  abstract deleteAddress(pacienteId: number, direccionId: number): Promise<void>;
}
