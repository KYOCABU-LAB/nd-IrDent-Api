import type {
    Doctor,
    DoctorResponseDto
} from    '../../application/dto/doctor';

export abstract class DoctorRepository {
  abstract createDoctor(data: Doctor): Promise<DoctorResponseDto>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByNumeroDocumento(numero_documento: string): Promise<boolean>;
}