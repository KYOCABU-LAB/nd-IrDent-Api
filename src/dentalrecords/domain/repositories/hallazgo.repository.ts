import {
  HallazgoEntity,
  HallazgoPacienteEntity,
  TipoHallazgo,
} from '../entities/hallazgo.entity';

/**
 * Repositorio abstracto para la gestión de hallazgos dentales y diagnósticos.
 *
 * Este repositorio maneja tanto los tipos de hallazgos disponibles (caries,
 * obturaciones, etc.) como los hallazgos específicos registrados en pacientes.
 * Incluye operaciones para el odontograma, reportes y estadísticas clínicas.
 *
 * @abstract
 * @class HallazgoRepository
 * @author Rfs
 * @version 1.0.0
 */
export abstract class HallazgoRepository {
  // ==================== OPERACIONES CRUD PARA TIPOS DE HALLAZGOS ====================

  /**
   * Obtiene todos los tipos de hallazgos disponibles en el sistema.
   *
   * @returns {Promise<HallazgoEntity[]>} Lista completa de tipos de hallazgos
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const tiposHallazgos = await hallazgoRepo.findAllHallazgos();
   * console.log(`Tipos disponibles: ${tiposHallazgos.length}`);
   * ```
   */
  abstract findAllHallazgos(): Promise<HallazgoEntity[]>;

  /**
   * Busca un tipo de hallazgo específico por su ID.
   *
   * @param {number} id - ID único del tipo de hallazgo
   * @returns {Promise<HallazgoEntity | null>} Tipo de hallazgo encontrado o null
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const caries = await hallazgoRepo.findHallazgoById(5);
   * if (caries) {
   *   console.log(`Hallazgo: ${caries.nombreHallazgo} (${caries.abreviacion})`);
   * }
   * ```
   */
  abstract findHallazgoById(id: number): Promise<HallazgoEntity | null>;

  /**
   * Obtiene tipos de hallazgos filtrados por tipo (diente completo o superficie).
   *
   * @param {TipoHallazgo} tipo - Tipo de hallazgo (diente o cara)
   * @returns {Promise<HallazgoEntity[]>} Hallazgos del tipo especificado
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const hallazgosDiente = await hallazgoRepo.findHallazgosByTipo(TipoHallazgo.DIENTE);
   * // Retorna: Corona Completa, Implante, Diente Ausente, etc.
   *
   * const hallazgosSuperficie = await hallazgoRepo.findHallazgosByTipo(TipoHallazgo.CARA);
   * // Retorna: Caries, Obturación, Resina, etc.
   * ```
   */
  abstract findHallazgosByTipo(tipo: TipoHallazgo): Promise<HallazgoEntity[]>;

  /**
   * Crea un nuevo tipo de hallazgo en el sistema.
   *
   * @param {Partial<HallazgoEntity>} hallazgo - Datos del nuevo tipo de hallazgo
   * @returns {Promise<HallazgoEntity>} Tipo de hallazgo creado
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const nuevoHallazgo = await hallazgoRepo.createHallazgo({
   *   nombreHallazgo: 'Fractura Vertical',
   *   abreviacion: 'FV',
   *   tipoHallazgo: TipoHallazgo.CARA,
   *   color: '#FF4500'
   * });
   * ```
   */
  abstract createHallazgo(
    hallazgo: Partial<HallazgoEntity>,
  ): Promise<HallazgoEntity>;

  /**
   * Actualiza un tipo de hallazgo existente.
   *
   * @param {number} id - ID del tipo de hallazgo a actualizar
   * @param {Partial<HallazgoEntity>} hallazgo - Datos a actualizar
   * @returns {Promise<HallazgoEntity>} Tipo de hallazgo actualizado
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const actualizado = await hallazgoRepo.updateHallazgo(5, {
   *   descripcion: 'Lesión cariosa profunda que requiere tratamiento inmediato'
   * });
   * ```
   */
  abstract updateHallazgo(
    id: number,
    hallazgo: Partial<HallazgoEntity>,
  ): Promise<HallazgoEntity>;

  /**
   * Elimina un tipo de hallazgo del sistema.
   *
   * @param {number} id - ID del tipo de hallazgo a eliminar
   * @returns {Promise<void>}
   * @throws {ConflictException} Si el hallazgo está siendo usado en pacientes
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * await hallazgoRepo.deleteHallazgo(10);
   * console.log('Tipo de hallazgo eliminado');
   * ```
   */
  abstract deleteHallazgo(id: number): Promise<void>;

  // ==================== OPERACIONES CRUD PARA HALLAZGOS DE PACIENTES ====================

  /**
   * Busca un hallazgo específico de un paciente por su ID.
   *
   * @param {number} id - ID único del hallazgo del paciente
   * @returns {Promise<HallazgoPacienteEntity | null>} Hallazgo encontrado o null
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const hallazgoPaciente = await hallazgoRepo.findHallazgoPacienteById(15);
   * if (hallazgoPaciente) {
   *   console.log(`Observaciones: ${hallazgoPaciente.observaciones}`);
   * }
   * ```
   */
  abstract findHallazgoPacienteById(
    id: number,
  ): Promise<HallazgoPacienteEntity | null>;

  /**
   * Registra un nuevo hallazgo en un paciente específico.
   *
   * @param {Partial<HallazgoPacienteEntity>} hallazgo - Datos del hallazgo a registrar
   * @returns {Promise<HallazgoPacienteEntity>} Hallazgo registrado
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const nuevoDiagnostico = await hallazgoRepo.createHallazgoPaciente({
   *   idDiente: 1,
   *   idSuperficieDental: 5,
   *   idPaciente: 123,
   *   idDoctor: 1,
   *   idHallazgo: 5,
   *   observaciones: 'Caries profunda en fosa central'
   * });
   * ```
   */
  abstract createHallazgoPaciente(
    hallazgo: Partial<HallazgoPacienteEntity>,
  ): Promise<HallazgoPacienteEntity>;

  /**
   * Actualiza un hallazgo existente de un paciente.
   *
   * @param {number} id - ID del hallazgo del paciente
   * @param {Partial<HallazgoPacienteEntity>} hallazgo - Datos a actualizar
   * @returns {Promise<HallazgoPacienteEntity>} Hallazgo actualizado
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const actualizado = await hallazgoRepo.updateHallazgoPaciente(15, {
   *   observaciones: 'Tratamiento completado, superficie restaurada'
   * });
   * ```
   */
  abstract updateHallazgoPaciente(
    id: number,
    hallazgo: Partial<HallazgoPacienteEntity>,
  ): Promise<HallazgoPacienteEntity>;

  /**
   * Elimina un hallazgo de un paciente.
   *
   * @param {number} id - ID del hallazgo del paciente a eliminar
   * @returns {Promise<void>}
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * await hallazgoRepo.deleteHallazgoPaciente(15);
   * console.log('Hallazgo eliminado del odontograma');
   * ```
   */
  abstract deleteHallazgoPaciente(id: number): Promise<void>;

  // ==================== CONSULTAS POR PACIENTE ====================

  /**
   * Obtiene todos los hallazgos registrados para un paciente específico.
   *
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos del paciente
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const hallazgosPaciente = await hallazgoRepo.findHallazgosByPaciente(123);
   * console.log(`Hallazgos del paciente: ${hallazgosPaciente.length}`);
   * ```
   */
  abstract findHallazgosByPaciente(
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  /**
   * Obtiene hallazgos de un paciente específico en un diente específico.
   *
   * @param {number} pacienteId - ID del paciente
   * @param {number} dienteId - ID del diente
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos del diente
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const hallazgosDiente16 = await hallazgoRepo.findHallazgosByPacienteYDiente(123, 1);
   * // Retorna todos los hallazgos del diente 16 del paciente 123
   * ```
   */
  abstract findHallazgosByPacienteYDiente(
    pacienteId: number,
    dienteId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  /**
   * Obtiene hallazgos de un paciente en una superficie específica.
   *
   * @param {number} pacienteId - ID del paciente
   * @param {number} superficieId - ID de la superficie dental
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos de la superficie
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const hallazgosSuperficie = await hallazgoRepo.findHallazgosByPacienteYSuperficie(123, 5);
   * // Útil para verificar si ya hay un diagnóstico en esa superficie
   * ```
   */
  abstract findHallazgosByPacienteYSuperficie(
    pacienteId: number,
    superficieId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  // ==================== CONSULTAS POR DIENTE ====================

  /**
   * Obtiene todos los hallazgos registrados en un diente específico (todos los pacientes).
   *
   * @param {number} dienteId - ID del diente
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos del diente
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const estadisticasDiente16 = await hallazgoRepo.findHallazgosByDiente(1);
   * // Útil para estadísticas: ¿qué problemas son más comunes en molares?
   * ```
   */
  abstract findHallazgosByDiente(
    dienteId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  /**
   * Obtiene todos los hallazgos registrados en una superficie específica (todos los pacientes).
   *
   * @param {number} superficieId - ID de la superficie dental
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos de la superficie
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const estadisticasOclusal = await hallazgoRepo.findHallazgosBySuperficie(5);
   * // Estadísticas: ¿qué superficies son más propensas a caries?
   * ```
   */
  abstract findHallazgosBySuperficie(
    superficieId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  // ==================== CONSULTAS POR DOCTOR ====================

  /**
   * Obtiene todos los hallazgos registrados por un doctor específico.
   *
   * @param {number} doctorId - ID del doctor
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos registrados por el doctor
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const diagnosticosDoctor = await hallazgoRepo.findHallazgosByDoctor(1);
   * // Para reportes de productividad y estadísticas del doctor
   * ```
   */
  abstract findHallazgosByDoctor(
    doctorId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  /**
   * Obtiene hallazgos registrados por un doctor en un paciente específico.
   *
   * @param {number} doctorId - ID del doctor
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos del doctor para ese paciente
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const historialDoctor = await hallazgoRepo.findHallazgosByDoctorYPaciente(1, 123);
   * // Historial de diagnósticos de un doctor específico para un paciente
   * ```
   */
  abstract findHallazgosByDoctorYPaciente(
    doctorId: number,
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  // ==================== CONSULTAS CON RELACIONES COMPLETAS ====================

  /**
   * Obtiene hallazgos de un paciente con todas las relaciones cargadas.
   * Incluye información del diente, superficie, tipo de hallazgo y doctor.
   *
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos con relaciones completas
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const odontogramaCompleto = await hallazgoRepo.findHallazgosWithDetails(123);
   * // Para mostrar el odontograma completo con toda la información
   * ```
   */
  abstract findHallazgosWithDetails(
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]>;

  /**
   * Obtiene un hallazgo específico con todas las relaciones cargadas.
   *
   * @param {number} id - ID del hallazgo del paciente
   * @returns {Promise<HallazgoPacienteEntity | null>} Hallazgo con detalles completos
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const detalleCompleto = await hallazgoRepo.findHallazgoWithDetails(15);
   * // Para mostrar información detallada de un diagnóstico específico
   * ```
   */
  abstract findHallazgoWithDetails(
    id: number,
  ): Promise<HallazgoPacienteEntity | null>;

  // ==================== VALIDACIONES ====================

  /**
   * Verifica si existe un tipo de hallazgo con el ID especificado.
   *
   * @param {number} id - ID del tipo de hallazgo
   * @returns {Promise<boolean>} true si existe, false si no
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const existe = await hallazgoRepo.existsHallazgoById(5);
   * if (!existe) {
   *   throw new NotFoundException('Tipo de hallazgo no encontrado');
   * }
   * ```
   */
  abstract existsHallazgoById(id: number): Promise<boolean>;

  /**
   * Verifica si existe un hallazgo de paciente con el ID especificado.
   *
   * @param {number} id - ID del hallazgo del paciente
   * @returns {Promise<boolean>} true si existe, false si no
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const existe = await hallazgoRepo.existsHallazgoPacienteById(15);
   * if (!existe) {
   *   throw new NotFoundException('Hallazgo del paciente no encontrado');
   * }
   * ```
   */
  abstract existsHallazgoPacienteById(id: number): Promise<boolean>;

  /**
   * Verifica si ya existe un hallazgo en una superficie específica de un paciente.
   *
   * @param {number} pacienteId - ID del paciente
   * @param {number} superficieId - ID de la superficie dental
   * @returns {Promise<boolean>} true si ya existe un hallazgo, false si no
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const yaExiste = await hallazgoRepo.hasHallazgoEnSuperficie(123, 5);
   * if (yaExiste) {
   *   throw new ConflictException('Ya existe un diagnóstico en esta superficie');
   * }
   * ```
   */
  abstract hasHallazgoEnSuperficie(
    pacienteId: number,
    superficieId: number,
  ): Promise<boolean>;

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtiene el conteo de hallazgos agrupados por tipo.
   *
   * @returns {Promise<{[tipo: string]: number}>} Conteos por tipo de hallazgo
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const estadisticas = await hallazgoRepo.countHallazgosByTipo();
   * // Resultado: { "Caries": 150, "Obturación": 89, "Corona": 23 }
   * ```
   */
  abstract countHallazgosByTipo(): Promise<{ [tipo: string]: number }>;

  /**
   * Obtiene el número total de hallazgos registrados para un paciente.
   *
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise<number>} Cantidad total de hallazgos del paciente
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const totalHallazgos = await hallazgoRepo.countHallazgosByPaciente(123);
   * console.log(`El paciente tiene ${totalHallazgos} diagnósticos registrados`);
   * ```
   */
  abstract countHallazgosByPaciente(pacienteId: number): Promise<number>;

  /**
   * Obtiene los tipos de hallazgos más comunes en el sistema.
   *
   * @param {number} [limit=10] - Número máximo de resultados a retornar
   * @returns {Promise<{hallazgo: string; count: number}[]>} Hallazgos más frecuentes
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const masComunes = await hallazgoRepo.getHallazgosMasComunes(5);
   * // Resultado: [
   * //   { hallazgo: "Caries", count: 150 },
   * //   { hallazgo: "Obturación", count: 89 },
   * //   ...
   * // ]
   * ```
   */
  abstract getHallazgosMasComunes(
    limit?: number,
  ): Promise<{ hallazgo: string; count: number }[]>;

  // ==================== PARA REPORTES ====================

  /**
   * Obtiene hallazgos registrados en un rango de fechas específico.
   *
   * @param {Date} fechaInicio - Fecha de inicio del rango
   * @param {Date} fechaFin - Fecha de fin del rango
   * @param {number} [pacienteId] - ID del paciente (opcional para filtrar)
   * @returns {Promise<HallazgoPacienteEntity[]>} Hallazgos en el rango de fechas
   * @memberof HallazgoRepository
   * @example
   * ```typescript
   * const inicioMes = new Date('2024-01-01');
   * const finMes = new Date('2024-01-31');
   *
   * // Todos los diagnósticos del mes
   * const diagnosticosMes = await hallazgoRepo.findHallazgosByDateRange(inicioMes, finMes);
   *
   * // Diagnósticos de un paciente específico en el mes
   * const pacienteMes = await hallazgoRepo.findHallazgosByDateRange(inicioMes, finMes, 123);
   * ```
   */
  abstract findHallazgosByDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    pacienteId?: number,
  ): Promise<HallazgoPacienteEntity[]>;
}
