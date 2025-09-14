import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';
import { PatientRepository, type PatientListFilters } from 'src/patients/domain/repositories/patient.interface';

@Injectable()
class PatientRepositoryImpl extends PatientRepository {
/**
 * Constructor of the PatientRepositoryImpl
 * @param {PrismaClient} prisma - The prisma client to interact with the database
 */
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  /**
   * Crea un paciente en la base de datos
   * @param data Dato del paciente a crear
   * @returns Promesa que se resuelve con el paciente creado
   */
  async create(data: CreatePatientDto): Promise<PatientResponseDto> {
    const payload = {
      ...data,
      fecha_nacimiento:
        typeof data.fecha_nacimiento === 'string'
          ? new Date(data.fecha_nacimiento)
          : data.fecha_nacimiento,
    };
    return this.prisma.paciente.create({ data: payload }) as unknown as PatientResponseDto;
  }

  /**
   * Actualiza un paciente por su id
   * @param id Identificador del paciente a actualizar
   * @param data Datos a actualizar
   * @returns Promesa que se resuelve con el paciente actualizado
   */
  async update(id: number, data: UpdatePatientDto): Promise<PatientResponseDto> {
    const payload: Prisma.PacienteUpdateInput = {
      ...data,
      ...(data.fecha_nacimiento && {
        fecha_nacimiento:
          typeof data.fecha_nacimiento === 'string'
            ? new Date(data.fecha_nacimiento)
            : data.fecha_nacimiento,
      }),
    };
    return this.prisma.paciente.update({
      where: { id },
      data: payload,
    }) as unknown as PatientResponseDto;
  }

  /**
   * Elimina un paciente de la base de datos
   * @param {number} id - id del paciente a eliminar
   */
  async delete(id: number): Promise<void> {
    await this.prisma.paciente.delete({ where: { id } });
  }

  /**
   * Elimina todos los pacientes de la base de datos
   * @returns {Promise<number>} - cantidad de pacientes eliminados
   */
  async clearAll(): Promise<number> {
    const res = await this.prisma.paciente.deleteMany();
    return res.count;
  }

  /**
   * Obtiene un paciente por su id
   * @param {number} id - id del paciente a buscar
   * @returns {Promise<PatientResponseDto | null>} - paciente encontrado o null si no se encuentra
   */
  async findById(id: number): Promise<PatientResponseDto | null> {
    const p = await this.prisma.paciente.findUnique({ where: { id } });
    return (p as unknown as PatientResponseDto) ?? null;
  }

  /**
   * Verifica si ya existe un paciente con el numero de documento o email proporcionado
   * @param {string} numero_documento - numero de documento del paciente a buscar
   * @param {string} email - email del paciente a buscar
   * @param {number} [excludeId] - id del paciente a excluir de la búsqueda
   * @returns {Promise<boolean>} - true si el paciente existe, false en caso contrario
   */
  async existsByDocumentoOrEmail(
    numero_documento: string,
    email: string,
    excludeId?: number,
  ): Promise<boolean> {
    const dup = await this.prisma.paciente.findFirst({
      where: {
        OR: [{ numero_documento }, { email }],
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!dup;
  }

  /**
   * Listado paginado + filtros
   * @param {Object} params - objeto que contiene los parámetros de búsqueda
   * @param {number} params.skip - número de pacientes a saltar
   * @param {number} params.take - número de pacientes a obtener
   * @param {PatientListFilters} [params.filters] - filtros de búsqueda
   * @returns {Promise<{ data: PatientResponseDto[]; total: number }>} - lista de pacientes encontrados
   */
  async list(params: {
    skip: number;
    take: number;
    filters?: PatientListFilters;
  }): Promise<{ data: PatientResponseDto[]; total: number }> {
    const { filters } = params;

    const whereParts: Prisma.PacienteWhereInput[] = [];

    if (filters?.nombre) {
      whereParts.push({ nombre: { contains: filters.nombre } });
    }
    if (filters?.numero_documento) {
      whereParts.push({ numero_documento: { equals: filters.numero_documento } });
    }
    if (filters?.email) {
      whereParts.push({ email: { contains: filters.email } });
    }

    const where: Prisma.PacienteWhereInput =
      whereParts.length ? { AND: whereParts } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.paciente.findMany({
        where,
        orderBy: { fecha_creacion: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.paciente.count({ where }),
    ]);

    return { data: data as unknown as PatientResponseDto[], total };
  }
}

export default PatientRepositoryImpl;
