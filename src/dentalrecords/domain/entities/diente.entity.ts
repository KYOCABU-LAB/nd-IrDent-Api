import { HallazgoPacienteEntity } from './hallazgo.entity';
import { ConfiguracionSuperficieEntity } from './superficie-dental.entity';

/**
 * Entidad que representa un diente en el sistema dental.
 * Cada diente tiene un número FDI único, un tipo anatómico específico
 * y puede tener múltiples configuraciones de superficie y hallazgos asociados.
 */
export class DienteEntity {
  id: number;
  numeroDiente: string;
  nombreDiente: string;
  descripcion?: string;
  edadDiente?: string;
  tipoDiente: TipoDiente;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // relaciones
  configuraciones?: ConfiguracionDienteEntity[];
  hallazgos?: HallazgoPacienteEntity[];
}

/**
 * Enumeración de los tipos anatómicos de dientes.
 * Clasifica los dientes según su función y anatomía (INCISIVO, CANINO, PREMOLAR, MOLAR).
 */
export enum TipoDiente {
  INCISIVO = 'INCISIVO',
  CANINO = 'CANINO',
  PREMOLAR = 'PREMOLAR',
  MOLAR = 'MOLAR',
}

/**
 * Entidad que relaciona un diente con su configuración de superficie.
 * Determina qué matriz de superficies utilizar para cada diente según su tipo anatómico.
 */
export class ConfiguracionDienteEntity {
  id: number;
  dienteId: number;
  configuracionSuperficieId: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  diente?: DienteEntity;
  configuracionSuperficie?: ConfiguracionSuperficieEntity;
}
