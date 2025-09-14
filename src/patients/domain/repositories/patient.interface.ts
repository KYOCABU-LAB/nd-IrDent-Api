import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
  
} from 'src/patients/application/dto/patient';

export type PatientListFilters = {
  nombre?: string;
  numero_documento?: string;
  email?: string;
};

export abstract class PatientRepository {
  abstract create(data: CreatePatientDto): Promise<PatientResponseDto>;
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
}
