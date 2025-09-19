import { DienteEntity, TipoDiente } from '../entities/diente.entity';

/**
 * Repositorio abstracto para la gestión de dientes en el sistema dental.
 *
 * Este repositorio define todas las operaciones necesarias para el manejo
 * de dientes, incluyendo operaciones CRUD básicas, consultas especializadas,
 * relaciones con superficies y hallazgos, y funciones de validación.
 *
 * @abstract
 * @class DienteRepository
 * @author Rfs
 * @version 1.0.0
 */
export abstract class DienteRepository {
  // ==================== OPERACIONES CRUD BÁSICAS ====================

  /**
   * Obtiene todos los dientes del sistema ordenados por número FDI.
   *
   * @returns {Promise<DienteEntity[]>} Lista completa de dientes
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const dientes = await dienteRepo.findAll();
   * console.log(`Total dientes: ${dientes.length}`);
   * ```
   */
  abstract findAll(): Promise<DienteEntity[]>;

  /**
   * Busca un diente específico por su ID único.
   *
   * @param {number} id - ID único del diente
   * @returns {Promise<DienteEntity | null>} Diente encontrado o null si no existe
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const diente = await dienteRepo.findById(1);
   * if (diente) {
   *   console.log(`Diente encontrado: ${diente.nombreDiente}`);
   * }
   * ```
   */
  abstract findById(id: number): Promise<DienteEntity | null>;

  /**
   * Busca un diente por su número FDI (11, 12, 16, etc.).
   *
   * @param {string} numero - Número FDI del diente (formato: [1-4][1-8])
   * @returns {Promise<DienteEntity | null>} Diente encontrado o null si no existe
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const molar = await dienteRepo.findByNumero('16');
   * if (molar) {
   *   console.log(`Encontrado: ${molar.nombreDiente}`);
   * }
   * ```
   */
  abstract findByNumero(numero: string): Promise<DienteEntity | null>;

  /**
   * Crea un nuevo diente en el sistema.
   *
   * @param {Partial<DienteEntity>} diente - Datos del diente a crear
   * @returns {Promise<DienteEntity>} Diente creado con ID asignado
   * @throws {ConflictException} Si el número de diente ya existe
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const nuevoDiente = await dienteRepo.create({
   *   numeroDiente: '17',
   *   nombreDiente: 'Segundo Molar Superior Derecho',
   *   tipoDiente: TipoDiente.MOLAR
   * });
   * ```
   */
  abstract create(diente: Partial<DienteEntity>): Promise<DienteEntity>;

  /**
   * Actualiza los datos de un diente existente.
   *
   * @param {number} id - ID del diente a actualizar
   * @param {Partial<DienteEntity>} diente - Datos a actualizar
   * @returns {Promise<DienteEntity>} Diente actualizado
   * @throws {NotFoundException} Si el diente no existe
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const dienteActualizado = await dienteRepo.update(1, {
   *   descripcion: 'Diente con tratamiento de conducto'
   * });
   * ```
   */
  abstract update(
    id: number,
    diente: Partial<DienteEntity>,
  ): Promise<DienteEntity>;

  /**
   * Elimina un diente del sistema.
   *
   * @param {number} id - ID del diente a eliminar
   * @returns {Promise<void>}
   * @throws {NotFoundException} Si el diente no existe
   * @throws {ConflictException} Si el diente tiene hallazgos asociados
   * @memberof DienteRepository
   * @example
   * ```typescript
   * await dienteRepo.delete(1);
   * console.log('Diente eliminado exitosamente');
   * ```
   */
  abstract delete(id: number): Promise<void>;

  // ==================== CONSULTAS ESPECÍFICAS ====================

  /**
   * Obtiene todos los dientes de un tipo específico.
   *
   * @param {TipoDiente} tipo - Tipo de diente (INCISIVO, CANINO, PREMOLAR, MOLAR)
   * @returns {Promise<DienteEntity[]>} Lista de dientes del tipo especificado
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const molares = await dienteRepo.findByTipo(TipoDiente.MOLAR);
   * console.log(`Molares encontrados: ${molares.length}`);
   * ```
   */
  abstract findByTipo(tipo: TipoDiente): Promise<DienteEntity[]>;

  /**
   * Obtiene dientes de múltiples tipos específicos.
   *
   * @param {TipoDiente[]} tipos - Array de tipos de dientes
   * @returns {Promise<DienteEntity[]>} Lista de dientes de los tipos especificados
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const posteriores = await dienteRepo.findByTipos([
   *   TipoDiente.PREMOLAR,
   *   TipoDiente.MOLAR
   * ]);
   * ```
   */
  abstract findByTipos(tipos: TipoDiente[]): Promise<DienteEntity[]>;

  /**
   * Obtiene dientes por múltiples números FDI.
   *
   * @param {string[]} numeros - Array de números FDI
   * @returns {Promise<DienteEntity[]>} Lista de dientes encontrados
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const cuadrante1 = await dienteRepo.findByNumeros([
   *   '11', '12', '13', '14', '15', '16', '17', '18'
   * ]);
   * ```
   */
  abstract findByNumeros(numeros: string[]): Promise<DienteEntity[]>;

  // ==================== CONSULTAS CON RELACIONES ====================

  /**
   * Obtiene un diente con todas sus superficies dentales configuradas.
   *
   * @param {number} id - ID del diente
   * @returns {Promise<DienteEntity | null>} Diente con superficies o null
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const dienteConSuperficies = await dienteRepo.findWithSuperficies(1);
   * if (dienteConSuperficies?.configuraciones) {
   *   console.log(`Superficies: ${dienteConSuperficies.configuraciones.length}`);
   * }
   * ```
   */
  abstract findWithSuperficies(id: number): Promise<DienteEntity | null>;

  /**
   * Obtiene un diente con todos sus hallazgos registrados.
   *
   * @param {number} id - ID del diente
   * @param {number} [pacienteId] - ID del paciente (opcional para filtrar)
   * @returns {Promise<DienteEntity | null>} Diente con hallazgos o null
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const dienteConHallazgos = await dienteRepo.findWithHallazgos(1, 123);
   * if (dienteConHallazgos?.hallazgos) {
   *   console.log(`Hallazgos: ${dienteConHallazgos.hallazgos.length}`);
   * }
   * ```
   */
  abstract findWithHallazgos(
    id: number,
    pacienteId?: number,
  ): Promise<DienteEntity | null>;

  /**
   * Obtiene todos los dientes con sus superficies configuradas.
   *
   * @returns {Promise<DienteEntity[]>} Lista completa de dientes con superficies
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const todosConSuperficies = await dienteRepo.findAllWithSuperficies();
   * console.log('Dientes cargados para odontograma');
   * ```
   */
  abstract findAllWithSuperficies(): Promise<DienteEntity[]>;

  // ==================== CONSULTAS PARA ODONTOGRAMA ====================

  /**
   * Obtiene dientes optimizados para mostrar en el odontograma.
   * Incluye superficies y hallazgos si se especifica un paciente.
   *
   * @param {number} [pacienteId] - ID del paciente (opcional)
   * @returns {Promise<DienteEntity[]>} Dientes preparados para odontograma
   * @memberof DienteRepository
   * @example
   * ```typescript
   * // Para odontograma vacío
   * const dientesVacios = await dienteRepo.findDientesForOdontograma();
   *
   * // Para odontograma de paciente específico
   * const dientesPaciente = await dienteRepo.findDientesForOdontograma(123);
   * ```
   */
  abstract findDientesForOdontograma(
    pacienteId?: number,
  ): Promise<DienteEntity[]>;

  // ==================== VALIDACIONES ====================

  /**
   * Verifica si existe un diente con el número FDI especificado.
   *
   * @param {string} numero - Número FDI a verificar
   * @returns {Promise<boolean>} true si existe, false si no
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const existe = await dienteRepo.existsByNumero('16');
   * if (existe) {
   *   throw new ConflictException('El diente 16 ya existe');
   * }
   * ```
   */
  abstract existsByNumero(numero: string): Promise<boolean>;

  /**
   * Verifica si existe un diente con el ID especificado.
   *
   * @param {number} id - ID a verificar
   * @returns {Promise<boolean>} true si existe, false si no
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const existe = await dienteRepo.existsById(1);
   * if (!existe) {
   *   throw new NotFoundException('Diente no encontrado');
   * }
   * ```
   */
  abstract existsById(id: number): Promise<boolean>;

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtiene el conteo de dientes agrupados por tipo.
   *
   * @returns {Promise<{[tipo: string]: number}>} Objeto con conteos por tipo
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const conteos = await dienteRepo.countByTipo();
   * // Resultado: { "MOLAR": 12, "PREMOLAR": 8, "INCISIVO": 8, "CANINO": 4 }
   * ```
   */
  abstract countByTipo(): Promise<{ [tipo: string]: number }>;

  /**
   * Obtiene el número total de dientes en el sistema.
   *
   * @returns {Promise<number>} Cantidad total de dientes
   * @memberof DienteRepository
   * @example
   * ```typescript
   * const total = await dienteRepo.countTotal();
   * console.log(`Total de dientes: ${total}`);
   * ```
   */
  abstract countTotal(): Promise<number>;
}
