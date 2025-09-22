import { TipoDiente, ConfiguracionDienteEntity } from './diente.entity';
/**
 * Entidad que representa una superficie específica de un diente.
 * Cada superficie tiene una posición en la matriz (fila, columna) y una cara anatómica específica.
 */
export class SuperficieDentalEntity {
  id: number;
  configuracionSuperficieId: number;
  fila: number;
  columna: number;
  codigo: string;
  caraAnatomica: CaraAnatomica;
  ubicacionEspecifica?: string;
  esActiva: boolean;
  descripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  configuracionSuperficie?: ConfiguracionSuperficieEntity;
  hallazgos?: HallazgoPacienteEntity[];
}

/**
 * Enumeración de las caras anatómicas de los dientes.
 * Define las diferentes superficies donde se pueden registrar hallazgos dentales.
 */
export enum CaraAnatomica {
  VESTIBULAR = 'VESTIBULAR',
  LINGUAL = 'LINGUAL',
  MESIAL = 'MESIAL',
  DISTAL = 'DISTAL',
  OCLUSAL = 'OCLUSAL',
  PALATINA = 'PALATINA',
}

/**
 * Entidad que define la configuración de matriz para cada tipo de diente.
 * Especifica cuántas filas y columnas tiene la matriz de superficies según el tipo anatómico.
 */
export class ConfiguracionSuperficieEntity {
  id: number;
  tipoDiente: TipoDiente;
  filas: number;
  columnas: number;
  descripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  superficies?: SuperficieDentalEntity[];
  configuracionesDiente?: ConfiguracionDienteEntity[];
}

export interface HallazgoPacienteEntity {
  id: number;
  idDiente: number;
  idSuperficieDental?: number;
  idPaciente: number;
  idDoctor: number;
  idHallazgo: number;
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
