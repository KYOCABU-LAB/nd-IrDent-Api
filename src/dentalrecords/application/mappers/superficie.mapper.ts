import { Injectable } from '@nestjs/common';
import {
  SuperficieDentalEntity,
  ConfiguracionSuperficieEntity,
  CaraAnatomica,
} from '../../domain/entities/superficie-dental.entity';
import { TipoDiente } from '../../domain/entities/diente.entity';

/**
 * Mapper para convertir entre datos de Prisma y entidades de dominio para Superficies.
 * Maneja tanto SuperficieDental como ConfiguracionSuperficie.
 */
@Injectable()
export class SuperficieMapper {
  /**
   * Convierte datos de Prisma a entidad SuperficieDental.
   */
  toSuperficieDomain(prismaData: any): SuperficieDentalEntity {
    return {
      id: prismaData.id,
      configuracionSuperficieId: prismaData.configuracionSuperficieId,
      fila: prismaData.fila,
      columna: prismaData.columna,
      codigo: prismaData.codigo,
      caraAnatomica: prismaData.cara_anatomica as CaraAnatomica,
      ubicacionEspecifica: prismaData.ubicacion_especifica,
      esActiva: prismaData.es_activa,
      descripcion: prismaData.descripcion,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }

  /**
   * Convierte entidad SuperficieDental a formato Prisma.
   */
  toSuperficiePrisma(entity: Partial<SuperficieDentalEntity>): any {
    const prismaData: any = {};

    if (entity.configuracionSuperficieId !== undefined) {
      prismaData.configuracionSuperficieId = entity.configuracionSuperficieId;
    }
    if (entity.fila !== undefined) {
      prismaData.fila = entity.fila;
    }
    if (entity.columna !== undefined) {
      prismaData.columna = entity.columna;
    }
    if (entity.codigo !== undefined) {
      prismaData.codigo = entity.codigo;
    }
    if (entity.caraAnatomica !== undefined) {
      prismaData.cara_anatomica = entity.caraAnatomica;
    }
    if (entity.ubicacionEspecifica !== undefined) {
      prismaData.ubicacion_especifica = entity.ubicacionEspecifica;
    }
    if (entity.esActiva !== undefined) {
      prismaData.es_activa = entity.esActiva;
    }
    if (entity.descripcion !== undefined) {
      prismaData.descripcion = entity.descripcion;
    }

    return prismaData;
  }

  /**
   * Convierte datos de Prisma a entidad ConfiguracionSuperficie.
   */
  toConfiguracionDomain(prismaData: any): ConfiguracionSuperficieEntity {
    return {
      id: prismaData.id,
      tipoDiente: prismaData.tipo_diente as TipoDiente,
      filas: prismaData.filas,
      columnas: prismaData.columnas,
      descripcion: prismaData.descripcion,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }

  /**
   * Convierte entidad ConfiguracionSuperficie a formato Prisma.
   */
  toConfiguracionPrisma(entity: Partial<ConfiguracionSuperficieEntity>): any {
    const prismaData: any = {};

    if (entity.tipoDiente !== undefined) {
      prismaData.tipo_diente = entity.tipoDiente;
    }
    if (entity.filas !== undefined) {
      prismaData.filas = entity.filas;
    }
    if (entity.columnas !== undefined) {
      prismaData.columnas = entity.columnas;
    }
    if (entity.descripcion !== undefined) {
      prismaData.descripcion = entity.descripcion;
    }

    return prismaData;
  }

  /**
   * Convierte datos de Prisma con relaciones incluidas para SuperficieDental.
   */
  toSuperficieDomainWithRelations(prismaData: any): SuperficieDentalEntity {
    const superficie = this.toSuperficieDomain(prismaData);

    if (prismaData.configuracion_superficie) {
      superficie.configuracionSuperficie = this.toConfiguracionDomain(
        prismaData.configuracion_superficie,
      );
    }

    if (prismaData.hallazgos_paciente) {
      superficie.hallazgos = prismaData.hallazgos_paciente.map(
        (hallazgo: any) => ({
          id: hallazgo.id,
          idDiente: hallazgo.id_diente,
          idSuperficieDental: hallazgo.id_superficie_dental,
          idPaciente: hallazgo.id_paciente,
          idDoctor: hallazgo.id_doctor,
          idHallazgo: hallazgo.id_hallazgo,
          observaciones: hallazgo.observaciones,
          fechaCreacion: hallazgo.fecha_creacion,
          fechaActualizacion: hallazgo.fecha_actualizacion,
        }),
      );
    }

    return superficie;
  }

  /**
   * Convierte datos de Prisma con relaciones incluidas para ConfiguracionSuperficie.
   */
  toConfiguracionDomainWithRelations(
    prismaData: any,
  ): ConfiguracionSuperficieEntity {
    const configuracion = this.toConfiguracionDomain(prismaData);

    if (prismaData.SuperficieDental) {
      configuracion.superficies = prismaData.SuperficieDental.map(
        (superficie: any) => this.toSuperficieDomain(superficie),
      ).filter(Boolean);
    }

    if (prismaData.ConfiguracionDiente) {
      configuracion.configuracionesDiente = prismaData.ConfiguracionDiente.map(
        (config: any) => ({
          id: config.id,
          dienteId: config.dienteId,
          configuracionSuperficieId: config.configuracionSuperficieId,
          fechaCreacion: config.fecha_creacion,
          fechaActualizacion: config.fecha_actualizacion,
        }),
      );
    }

    return configuracion;
  }

  /**
   * Convierte array de SuperficieDental de Prisma a entidades.
   */
  toSuperficieArray(prismaArray: any[]): SuperficieDentalEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toSuperficieDomain(item))
      .filter(Boolean);
  }

  /**
   * Convierte array de ConfiguracionSuperficie de Prisma a entidades.
   */
  toConfiguracionArray(prismaArray: any[]): ConfiguracionSuperficieEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toConfiguracionDomain(item))
      .filter(Boolean);
  }

  /**
   * Convierte array de SuperficieDental con relaciones de Prisma a entidades.
   */
  toSuperficieArrayWithRelations(prismaArray: any[]): SuperficieDentalEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toSuperficieDomainWithRelations(item))
      .filter(Boolean);
  }
}
