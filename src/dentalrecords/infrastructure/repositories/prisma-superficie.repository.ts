import { Injectable } from '@nestjs/common';
import { SuperficieRepository } from '../../domain/repositories/superficie.repository';
import {
  SuperficieDentalEntity,
  ConfiguracionSuperficieEntity,
  CaraAnatomica,
} from '../../domain/entities/superficie-dental.entity';
import { TipoDiente } from '../../domain/entities/diente.entity';
import { SuperficieMapper } from '../../application/mappers/superficie.mapper';
import { PrismaService } from '../../../shared/prisma/prisma.service';

/**
 * Implementación del repositorio de superficies usando Prisma ORM.
 *
 * Esta clase implementa todas las operaciones definidas en SuperficieRepository
 * utilizando Prisma como ORM para interactuar con la base de datos MySQL.
 *
 * @class PrismaSuperficieRepository
 * @extends {SuperficieRepository}
 * @author Rfs
 * @version 1.0.0
 */
@Injectable()
export class PrismaSuperficieRepository extends SuperficieRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SuperficieMapper,
  ) {
    super();
  }

  async findById(id: number): Promise<SuperficieDentalEntity | null> {
    const superficie = await this.prisma.superficieDental.findUnique({
      where: { id },
    });
    return this.mapper.toSuperficieDomain(superficie);
  }

  async findAll(): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      orderBy: [
        { configuracionSuperficieId: 'asc' },
        { fila: 'asc' },
        { columna: 'asc' },
      ],
    });
    return this.mapper.toSuperficieArray(superficies);
  }

  async findByConfiguracion(
    configuracionId: number,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: { configuracionSuperficieId: configuracionId },
      orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
    });
    return this.mapper.toSuperficieArray(superficies);
  }

  async findByTipoDiente(
    tipoDiente: TipoDiente,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: {
        configuracion_superficie: {
          tipo_diente: tipoDiente,
        },
      },
      include: {
        configuracion_superficie: true,
      },
      orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
    });
    return this.mapper.toSuperficieArrayWithRelations(superficies);
  }

  async findActivasByConfiguracion(
    configuracionId: number,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: {
        configuracionSuperficieId: configuracionId,
        es_activa: true,
      },
      orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
    });
    return this.mapper.toSuperficieArray(superficies);
  }

  async findByCaraAnatomica(
    cara: CaraAnatomica,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: { cara_anatomica: cara },
      orderBy: [
        { configuracionSuperficieId: 'asc' },
        { fila: 'asc' },
        { columna: 'asc' },
      ],
    });
    return this.mapper.toSuperficieArray(superficies);
  }

  async findByPosicion(
    fila: number,
    columna: number,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: {
        fila: fila,
        columna: columna,
      },
      include: {
        configuracion_superficie: true,
      },
      orderBy: { configuracionSuperficieId: 'asc' },
    });
    return this.mapper.toSuperficieArrayWithRelations(superficies);
  }

  async findConfiguracionByTipo(
    tipoDiente: TipoDiente,
  ): Promise<ConfiguracionSuperficieEntity | null> {
    const configuracion = await this.prisma.configuracionSuperficie.findUnique({
      where: { tipo_diente: tipoDiente },
    });
    return this.mapper.toConfiguracionDomain(configuracion);
  }

  async findAllConfiguraciones(): Promise<ConfiguracionSuperficieEntity[]> {
    const configuraciones = await this.prisma.configuracionSuperficie.findMany({
      orderBy: { tipo_diente: 'asc' },
    });
    return this.mapper.toConfiguracionArray(configuraciones);
  }

  async findSuperficiesForDiente(
    dienteId: number,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: {
        configuracion_superficie: {
          ConfiguracionDiente: {
            some: {
              dienteId: dienteId,
            },
          },
        },
      },
      include: {
        configuracion_superficie: true,
      },
      orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
    });
    return this.mapper.toSuperficieArrayWithRelations(superficies);
  }

  async findSuperficiesActivasForDiente(
    dienteId: number,
  ): Promise<SuperficieDentalEntity[]> {
    const superficies = await this.prisma.superficieDental.findMany({
      where: {
        es_activa: true,
        configuracion_superficie: {
          ConfiguracionDiente: {
            some: {
              dienteId: dienteId,
            },
          },
        },
      },
      include: {
        configuracion_superficie: true,
      },
      orderBy: [{ fila: 'asc' }, { columna: 'asc' }],
    });
    return this.mapper.toSuperficieArrayWithRelations(superficies);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.prisma.superficieDental.count({
      where: { id },
    });
    return count > 0;
  }

  async isSuperficieActiva(id: number): Promise<boolean> {
    const superficie = await this.prisma.superficieDental.findUnique({
      where: { id },
      select: { es_activa: true },
    });
    return superficie?.es_activa || false;
  }

  async countByTipoDiente(): Promise<{ [tipo: string]: number }> {
    const result = await this.prisma.superficieDental.groupBy({
      by: ['configuracionSuperficieId'],
      _count: {
        id: true,
      },
    });

    // consulta para los tipos
    const configuraciones = await this.prisma.configuracionSuperficie.findMany({
      select: {
        id: true,
        tipo_diente: true,
      },
    });

    const configMap = new Map(
      configuraciones.map((c) => [c.id, c.tipo_diente]),
    );
    const counts: { [tipo: string]: number } = {};

    result.forEach((item) => {
      const tipo = configMap.get(item.configuracionSuperficieId);
      if (tipo) {
        counts[tipo] = (counts[tipo] || 0) + item._count.id;
      }
    });

    return counts;
  }

  async countActivasByTipo(): Promise<{ [tipo: string]: number }> {
    const result = await this.prisma.superficieDental.groupBy({
      by: ['configuracionSuperficieId'],
      where: { es_activa: true },
      _count: {
        id: true,
      },
    });

    // se obtiene los tipos de configuración
    const configuraciones = await this.prisma.configuracionSuperficie.findMany({
      select: {
        id: true,
        tipo_diente: true,
      },
    });

    const configMap = new Map(
      configuraciones.map((c) => [c.id, c.tipo_diente]),
    );
    const counts: { [tipo: string]: number } = {};

    result.forEach((item) => {
      const tipo = configMap.get(item.configuracionSuperficieId);
      if (tipo) {
        counts[tipo] = (counts[tipo] || 0) + item._count.id;
      }
    });

    return counts;
  }
}
