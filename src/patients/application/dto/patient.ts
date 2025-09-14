import { EnumEstadocivil, EnumGenero, EnumTipoDocumento } from 'generated/prisma';

export interface CreatePatientDto {
  numero_documento: string;
  tipo_documento?: EnumTipoDocumento; 
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: Date | string;
  genero?: EnumGenero; 
  telefono: string;
  email: string;
  direccion: string;
  estado_civil: EnumEstadocivil;
  ocupacion: string;
}

export interface UpdatePatientDto {
  numero_documento?: string;
  tipo_documento?: EnumTipoDocumento;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  fecha_nacimiento?: Date | string;
  genero?: EnumGenero;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado_civil?: EnumEstadocivil;
  ocupacion?: string;
}

export interface PatientResponseDto {
  id: number;
  numero_documento: string;
  tipo_documento: EnumTipoDocumento;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: Date;
  genero: EnumGenero;
  telefono: string;
  email: string;
  direccion: string;
  estado_civil: EnumEstadocivil;
  ocupacion: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}


