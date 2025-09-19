import { Injectable } from '@nestjs/common';
import { DienteRepository } from '../../domain/repositories/diente.repository';
import { DienteEntity, TipoDiente } from '../../domain/entities/diente.entity';
import { DienteMapper } from '../../application/mappers/diente.mapper';
import { PrismaService } from '../../../shared/prisma/prisma.service';

/**
 * Implementación del repositorio de dientes usando Prisma ORM.
 *
 * Esta clase implementa todas las operaciones definidas en DienteRepository
 * utilizando Prisma como ORM para interactuar con la base de datos MySQL.
 *
 * @class PrismaDienteRepository
 * @extends {DienteRepository}
 * @author Rfs
 * @version 1.0.0
 */
@Injectable()
export class PrismaDienteRepository extends DienteRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DienteMapper,
  ) {
    super();
  }

  async findAll(): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      orderBy: { numero_diente: 'asc' },
    });
    return this.mapper.toDomainArray(dientes);
  }

  async findById(id: number): Promise<DienteEntity | null> {
    const diente = await this.prisma.diente.findUnique({
      where: { id },
    });
    return this.mapper.toDomain(diente);
  }

  async findByNumero(numero: string): Promise<DienteEntity | null> {
    const diente = await this.prisma.diente.findUnique({
      where: { numero_diente: numero },
    });
    return this.mapper.toDomain(diente);
  }

  async create(diente: Partial<DienteEntity>): Promise<DienteEntity> {
    const created = await this.prisma.diente.create({
      data: this.mapper.toPrisma(diente),
    });
    return this.mapper.toDomain(created);
  }

  async update(
    id: number,
    diente: Partial<DienteEntity>,
  ): Promise<DienteEntity> {
    const updated = await this.prisma.diente.update({
      where: { id },
      data: {
        nombre_diente: diente.nombreDiente,
        descripcion: diente.descripcion,
        edad_diente: diente.edadDiente,
        tipo_diente: diente.tipoDiente,
      },
    });
    return this.mapToDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.diente.delete({
      where: { id },
    });
  }

  async findByTipo(tipo: TipoDiente): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      where: { tipo_diente: tipo },
      orderBy: { numero_diente: 'asc' },
    });
    return dientes.map(this.mapToDomain);
  }

  async findByTipos(tipos: TipoDiente[]): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      where: {
        tipo_diente: { in: tipos },
      },
      orderBy: { numero_diente: 'asc' },
    });
    return dientes.map(this.mapToDomain);
  }

  async findByNumeros(numeros: string[]): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      where: {
        numero_diente: { in: numeros },
      },
      orderBy: { numero_diente: 'asc' },
    });
    return dientes.map(this.mapToDomain);
  }

  async findWithSuperficies(id: number): Promise<DienteEntity | null> {
    const diente = await this.prisma.diente.findUnique({
      where: { id },
      include: {
        ConfiguracionDiente: {
          include: {
            configuracion_superficie: {
              include: {
                SuperficieDental: {
                  where: { es_activa: true },
                  orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
                },
              },
            },
          },
        },
      },
    });

    if (!diente) return null;

    const dienteEntity = this.mapToDomain(diente);
    // Aquí mapearías las superficies también
    return dienteEntity;
  }

  async findWithHallazgos(
    id: number,
    pacienteId?: number,
  ): Promise<DienteEntity | null> {
    const whereClause: any = { id_diente: id };
    if (pacienteId) {
      whereClause.id_paciente = pacienteId;
    }

    const diente = await this.prisma.diente.findUnique({
      where: { id },
      include: {
        hallazgos_paciente: {
          where: whereClause,
          include: {
            hallazgo: true,
            superficie_dental: true,
          },
        },
      },
    });

    return diente ? this.mapToDomain(diente) : null;
  }

  async findAllWithSuperficies(): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      include: {
        ConfiguracionDiente: {
          include: {
            configuracion_superficie: {
              include: {
                SuperficieDental: {
                  where: { es_activa: true },
                },
              },
            },
          },
        },
      },
      orderBy: { numero_diente: 'asc' },
    });

    return dientes.map(this.mapToDomain);
  }

  async findDientesForOdontograma(
    pacienteId?: number,
  ): Promise<DienteEntity[]> {
    const includeClause: any = {
      ConfiguracionDiente: {
        include: {
          configuracion_superficie: {
            include: {
              SuperficieDental: {
                where: { es_activa: true },
              },
            },
          },
        },
      },
    };

    if (pacienteId) {
      includeClause.hallazgos_paciente = {
        where: { id_paciente: pacienteId },
        include: {
          hallazgo: true,
          superficie_dental: true,
        },
      };
    }

    const dientes = await this.prisma.diente.findMany({
      include: includeClause,
      orderBy: { numero_diente: 'asc' },
    });

    return dientes.map(this.mapToDomain);
  }

  async existsByNumero(numero: string): Promise<boolean> {
    const count = await this.prisma.diente.count({
      where: { numero_diente: numero },
    });
    return count > 0;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.prisma.diente.count({
      where: { id },
    });
    return count > 0;
  }

  async countByTipo(): Promise<{ [tipo: string]: number }> {
    const result = await this.prisma.diente.groupBy({
      by: ['tipo_diente'],
      _count: {
        id: true,
      },
    });

    const counts: { [tipo: string]: number } = {};
    result.forEach((item) => {
      counts[item.tipo_diente] = item._count.id;
    });

    return counts;
  }

  async countTotal(): Promise<number> {
    return this.prisma.diente.count();
  }

  // Método privado para mapear de Prisma a Domain
  private mapToDomain(prismaData: any): DienteEntity {
    return {
      id: prismaData.id,
      numeroDiente: prismaData.numero_diente,
      nombreDiente: prismaData.nombre_diente,
      descripcion: prismaData.descripcion,
      edadDiente: prismaData.edad_diente,
      tipoDiente: prismaData.tipo_diente as TipoDiente,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }
}
