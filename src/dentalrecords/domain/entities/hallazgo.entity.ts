/**
 * Entidad que representa un tipo de hallazgo dental disponible en el sistema.
 * Define los diferentes diagnósticos que se pueden registrar (caries, obturación, corona, etc.).
 */
export class HallazgoEntity {
  id: number;
  nombreHallazgo: string;
  abreviacion?: string;
  descripcion?: string;
  tipoHallazgo: TipoHallazgo;
  color?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  hallazgosPaciente?: HallazgoPacienteEntity[];
}

/**
 * Enumeración de los tipos de hallazgos según su alcance.
 * Determina si el hallazgo afecta todo el diente o solo una superficie específica.
 */
export enum TipoHallazgo {
  DIENTE = 'diente',
  CARA = 'cara',
}

/**
 * Entidad que representa un hallazgo específico registrado en un paciente.
 * Vincula un tipo de hallazgo con un diente/superficie específica de un paciente.
 */
export class HallazgoPacienteEntity {
  id: number;
  idDiente: number;
  idSuperficieDental?: number;
  idPaciente: number;
  idDoctor: number;
  idHallazgo: number;
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  diente?: import('./diente.entity').DienteEntity;
  superficieDental?: import('./superficie-dental.entity').SuperficieDentalEntity;
  hallazgo?: HallazgoEntity;
}
