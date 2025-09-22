import type {
    Doctor,
    DoctorResponseDto
} from    '../../application/dto/doctor';

export abstract class DoctorRepository {
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByNumeroDocumento(numero_documento: string): Promise<boolean>;
  
  abstract createDoctor(data: Doctor): Promise<DoctorResponseDto>;
  abstract findById(id: number): Promise<DoctorResponseDto>;
  abstract findAll(): Promise<DoctorResponseDto[]>;
  abstract updateDoctor(id: number, data: Partial<Doctor>): Promise<DoctorResponseDto>;
  abstract deleteDoctor(id: number): Promise<void>;
}