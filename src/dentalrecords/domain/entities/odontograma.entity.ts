import { DienteEntity } from './diente.entity';
import { SuperficieDentalEntity } from './superficie-dental.entity';
import { HallazgoPacienteEntity } from './hallazgo.entity';

/**
 * Entidad principal del odontograma que agrupa toda la información dental de un paciente.
 * Contiene todos los dientes con sus superficies y hallazgos asociados.
 */
export class OdontogramaEntity {
  pacienteId: number;
  dientes: DienteOdontogramaEntity[];
  fechaUltimaActualizacion: Date;
}

/**
 * Entidad que representa un diente dentro del contexto del odontograma.
 * Incluye el diente base, sus superficies configuradas y los hallazgos registrados.
 */
export class DienteOdontogramaEntity {
  diente: DienteEntity;
  superficies: SuperficieOdontogramaEntity[];
  hallazgosDiente: HallazgoPacienteEntity[];
}

/**
 * Entidad que representa una superficie dental dentro del odontograma.
 * Combina la configuración de la superficie con el hallazgo específico registrado (si existe).
 */
export class SuperficieOdontogramaEntity {
  superficie: SuperficieDentalEntity;
  hallazgo?: HallazgoPacienteEntity;
}

/**
 * Interface para el resumen estadístico del odontograma.
 * Proporciona métricas generales sobre el estado dental del paciente.
 */
export interface OdontogramaResumen {
  totalDientes: number;
  dientesConHallazgos: number;
  hallazgosPorTipo: {
    [tipo: string]: number;
  };
  ultimaActualizacion: Date;
}
