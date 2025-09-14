import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';

export abstract class PatientRepository {
  abstract create(data: CreatePatientDto): Promise<PatientResponseDto>;
  abstract update(id: number, data: UpdatePatientDto): Promise<PatientResponseDto>;
  abstract delete(id: number): Promise<void>;
  abstract clearAll(): Promise<number>; 
  abstract findById(id: number): Promise<PatientResponseDto | null>;
  abstract existsByDocumentoOrEmail(
    numero_documento: string,
    email: string,
    excludeId?: number,
  ): Promise<boolean>;
  abstract list(params: { skip: number; take: number; q?: string }): Promise<{
    data: PatientResponseDto[];
    total: number;
  }>;
}
