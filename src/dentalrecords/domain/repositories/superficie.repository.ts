import {
  SuperficieDentalEntity,
  ConfiguracionSuperficieEntity,
  CaraAnatomica,
} from '../entities/superficie-dental.entity';
import { TipoDiente } from '../entities/diente.entity';

/**
 * Repositorio abstracto para la gestión de superficies dentales y configuraciones.
 *
 * Este repositorio maneja las superficies dentales que conforman las matrices
 * de cada tipo de diente, así como las configuraciones que definen cómo se
 * organizan estas superficies según la anatomía dental.
 *
 * @abstract
 * @class SuperficieRepository
 * @author Rfs
 * @version 1.0.0
 */
export abstract class SuperficieRepository {
  // ==================== OPERACIONES BÁSICAS ====================

  /**
   * Busca una superficie dental específica por su ID único.
   *
   * @param {number} id - ID único de la superficie dental
   * @returns {Promise<SuperficieDentalEntity | null>} Superficie encontrada o null
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const superficie = await superficieRepo.findById(5);
   * if (superficie) {
   *   console.log(`Superficie: ${superficie.codigo} - ${superficie.caraAnatomica}`);
   * }
   * ```
   */
  abstract findById(id: number): Promise<SuperficieDentalEntity | null>;

  /**
   * Obtiene todas las superficies dentales del sistema.
   *
   * @returns {Promise<SuperficieDentalEntity[]>} Lista completa de superficies
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const todasSuperficies = await superficieRepo.findAll();
   * console.log(`Total superficies: ${todasSuperficies.length}`);
   * ```
   */
  abstract findAll(): Promise<SuperficieDentalEntity[]>;

  // ==================== CONSULTAS POR CONFIGURACIÓN ====================

  /**
   * Obtiene todas las superficies de una configuración específica.
   *
   * @param {number} configuracionId - ID de la configuración de superficie
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies de la configuración
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const superficiesMolar = await superficieRepo.findByConfiguracion(4);
   * console.log(`Superficies del molar: ${superficiesMolar.length}`);
   * ```
   */
  abstract findByConfiguracion(
    configuracionId: number,
  ): Promise<SuperficieDentalEntity[]>;

  /**
   * Obtiene todas las superficies de un tipo de diente específico.
   *
   * @param {TipoDiente} tipoDiente - Tipo de diente (INCISIVO, CANINO, etc.)
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies del tipo de diente
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const superficiesIncisivo = await superficieRepo.findByTipoDiente(TipoDiente.INCISIVO);
   * // Retorna superficies V, V2, V3, M, D, L, L2, L3 (sin centro)
   * ```
   */
  abstract findByTipoDiente(
    tipoDiente: TipoDiente,
  ): Promise<SuperficieDentalEntity[]>;

  // ==================== CONSULTAS ESPECÍFICAS ====================

  /**
   * Obtiene solo las superficies activas de una configuración.
   * Las superficies activas son las que se pueden clickear en el odontograma.
   *
   * @param {number} configuracionId - ID de la configuración
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies activas únicamente
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const activasIncisivo = await superficieRepo.findActivasByConfiguracion(1);
   * // Para incisivos: 8 superficies (excluye el centro vacío)
   * ```
   */
  abstract findActivasByConfiguracion(
    configuracionId: number,
  ): Promise<SuperficieDentalEntity[]>;

  /**
   * Obtiene superficies por cara anatómica específica.
   *
   * @param {CaraAnatomica} cara - Cara anatómica (VESTIBULAR, LINGUAL, etc.)
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies de la cara especificada
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const vestibulares = await superficieRepo.findByCaraAnatomica(CaraAnatomica.VESTIBULAR);
   * // Retorna todas las superficies vestibulares de todos los tipos de dientes
   * ```
   */
  abstract findByCaraAnatomica(
    cara: CaraAnatomica,
  ): Promise<SuperficieDentalEntity[]>;

  /**
   * Obtiene superficies por posición específica en la matriz.
   *
   * @param {number} fila - Número de fila (0, 1, 2)
   * @param {number} columna - Número de columna (0-4 dependiendo del tipo)
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies en esa posición
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const centroSuperiores = await superficieRepo.findByPosicion(0, 1);
   * // Retorna superficies V2 de todos los tipos de dientes
   * ```
   */
  abstract findByPosicion(
    fila: number,
    columna: number,
  ): Promise<SuperficieDentalEntity[]>;

  // ==================== CONFIGURACIONES DE SUPERFICIE ====================

  /**
   * Obtiene la configuración de superficie para un tipo de diente específico.
   *
   * @param {TipoDiente} tipoDiente - Tipo de diente
   * @returns {Promise<ConfiguracionSuperficieEntity | null>} Configuración o null
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const configMolar = await superficieRepo.findConfiguracionByTipo(TipoDiente.MOLAR);
   * if (configMolar) {
   *   console.log(`Matriz: ${configMolar.filas}x${configMolar.columnas}`);
   * }
   * ```
   */
  abstract findConfiguracionByTipo(
    tipoDiente: TipoDiente,
  ): Promise<ConfiguracionSuperficieEntity | null>;

  /**
   * Obtiene todas las configuraciones de superficie disponibles.
   *
   * @returns {Promise<ConfiguracionSuperficieEntity[]>} Lista de configuraciones
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const configuraciones = await superficieRepo.findAllConfiguraciones();
   * // Retorna configuraciones para INCISIVO, CANINO, PREMOLAR, MOLAR
   * ```
   */
  abstract findAllConfiguraciones(): Promise<ConfiguracionSuperficieEntity[]>;

  // ==================== PARA ODONTOGRAMA ====================

  /**
   * Obtiene todas las superficies configuradas para un diente específico.
   *
   * @param {number} dienteId - ID del diente
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies del diente
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const superficiesDiente16 = await superficieRepo.findSuperficiesForDiente(1);
   * // Retorna todas las superficies del diente 16 (molar)
   * ```
   */
  abstract findSuperficiesForDiente(
    dienteId: number,
  ): Promise<SuperficieDentalEntity[]>;

  /**
   * Obtiene solo las superficies activas de un diente específico.
   * Útil para generar el odontograma interactivo.
   *
   * @param {number} dienteId - ID del diente
   * @returns {Promise<SuperficieDentalEntity[]>} Superficies activas del diente
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const clickeables = await superficieRepo.findSuperficiesActivasForDiente(1);
   * // Solo superficies donde se pueden registrar hallazgos
   * ```
   */
  abstract findSuperficiesActivasForDiente(
    dienteId: number,
  ): Promise<SuperficieDentalEntity[]>;

  // ==================== VALIDACIONES ====================

  /**
   * Verifica si existe una superficie con el ID especificado.
   *
   * @param {number} id - ID de la superficie a verificar
   * @returns {Promise<boolean>} true si existe, false si no
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const existe = await superficieRepo.existsById(5);
   * if (!existe) {
   *   throw new NotFoundException('Superficie no encontrada');
   * }
   * ```
   */
  abstract existsById(id: number): Promise<boolean>;

  /**
   * Verifica si una superficie específica está activa (clickeable).
   *
   * @param {number} id - ID de la superficie
   * @returns {Promise<boolean>} true si está activa, false si no
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const esActiva = await superficieRepo.isSuperficieActiva(5);
   * if (!esActiva) {
   *   throw new BadRequestException('No se pueden registrar hallazgos en esta superficie');
   * }
   * ```
   */
  abstract isSuperficieActiva(id: number): Promise<boolean>;

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtiene el conteo de superficies agrupadas por tipo de diente.
   *
   * @returns {Promise<{[tipo: string]: number}>} Conteos por tipo de diente
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const conteos = await superficieRepo.countByTipoDiente();
   * // Resultado: { "MOLAR": 15, "PREMOLAR": 9, "INCISIVO": 8, "CANINO": 8 }
   * ```
   */
  abstract countByTipoDiente(): Promise<{ [tipo: string]: number }>;

  /**
   * Obtiene el conteo de superficies activas agrupadas por tipo de diente.
   *
   * @returns {Promise<{[tipo: string]: number}>} Conteos de superficies activas
   * @memberof SuperficieRepository
   * @example
   * ```typescript
   * const activasPorTipo = await superficieRepo.countActivasByTipo();
   * // Muestra cuántas superficies clickeables tiene cada tipo
   * ```
   */
  abstract countActivasByTipo(): Promise<{ [tipo: string]: number }>;
}
