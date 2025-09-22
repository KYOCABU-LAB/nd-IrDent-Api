import { Injectable } from '@nestjs/common';
import {
  HallazgoEntity,
  HallazgoPacienteEntity,
  TipoHallazgo,
} from '../../domain/entities/hallazgo.entity';

/**
 * Mapper para convertir entre datos de Prisma y entidades de dominio para Hallazgos.
 * Maneja tanto Hallazgo como HallazgoPaciente.
 */
@Injectable()
export class HallazgoMapper {
  /**
   * Convierte datos de Prisma a entidad Hallazgo.
   */
  toHallazgoDomain(prismaData: any): HallazgoEntity {
    return {
      id: prismaData.id,
      nombreHallazgo: prismaData.nombre_hallazgo,
      abreviacion: prismaData.abreviacion,
      descripcion: prismaData.descripcion,
      tipoHallazgo: prismaData.tipo_hallazgo as TipoHallazgo,
      color: prismaData.color,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }

  /**
   * Convierte entidad Hallazgo a formato Prisma.
   */
  toHallazgoPrisma(entity: Partial<HallazgoEntity>): any {
    const prismaData: any = {};

    if (entity.nombreHallazgo !== undefined) {
      prismaData.nombre_hallazgo = entity.nombreHallazgo;
    }
    if (entity.abreviacion !== undefined) {
      prismaData.abreviacion = entity.abreviacion;
    }
    if (entity.descripcion !== undefined) {
      prismaData.descripcion = entity.descripcion;
    }
    if (entity.tipoHallazgo !== undefined) {
      prismaData.tipo_hallazgo = entity.tipoHallazgo;
    }
    if (entity.color !== undefined) {
      prismaData.color = entity.color;
    }

    return prismaData;
  }

  /**
   * Convierte datos de Prisma a entidad HallazgoPaciente.
   */
  toHallazgoPacienteDomain(prismaData: any): HallazgoPacienteEntity {
    return {
      id: prismaData.id,
      idDiente: prismaData.id_diente,
      idSuperficieDental: prismaData.id_superficie_dental,
      idPaciente: prismaData.id_paciente,
      idDoctor: prismaData.id_doctor,
      idHallazgo: prismaData.id_hallazgo,
      observaciones: prismaData.observaciones,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }

  /**
   * Convierte entidad HallazgoPaciente a formato Prisma.
   */
  toHallazgoPacientePrisma(entity: Partial<HallazgoPacienteEntity>): any {
    const prismaData: any = {};

    if (entity.idDiente !== undefined) {
      prismaData.id_diente = entity.idDiente;
    }
    if (entity.idSuperficieDental !== undefined) {
      prismaData.id_superficie_dental = entity.idSuperficieDental;
    }
    if (entity.idPaciente !== undefined) {
      prismaData.id_paciente = entity.idPaciente;
    }
    if (entity.idDoctor !== undefined) {
      prismaData.id_doctor = entity.idDoctor;
    }
    if (entity.idHallazgo !== undefined) {
      prismaData.id_hallazgo = entity.idHallazgo;
    }
    if (entity.observaciones !== undefined) {
      prismaData.observaciones = entity.observaciones;
    }

    return prismaData;
  }

  /**
   * Convierte datos de Prisma con relaciones incluidas para Hallazgo.
   */
  toHallazgoDomainWithRelations(prismaData: any): HallazgoEntity {
    const hallazgo = this.toHallazgoDomain(prismaData);

    if (prismaData.hallazgos_paciente) {
      hallazgo.hallazgosPaciente = prismaData.hallazgos_paciente
        .map((hp: any) => this.toHallazgoPacienteDomain(hp))
        .filter(Boolean);
    }

    return hallazgo;
  }

  /**
   * Convierte datos de Prisma con relaciones incluidas para HallazgoPaciente.
   */
  toHallazgoPacienteDomainWithRelations(
    prismaData: any,
  ): HallazgoPacienteEntity {
    const hallazgoPaciente = this.toHallazgoPacienteDomain(prismaData);

    if (prismaData.diente) {
      hallazgoPaciente.diente = {
        id: prismaData.diente.id,
        numeroDiente: prismaData.diente.numero_diente,
        nombreDiente: prismaData.diente.nombre_diente,
        descripcion: prismaData.diente.descripcion,
        edadDiente: prismaData.diente.edad_diente,
        tipoDiente: prismaData.diente.tipo_diente,
        fechaCreacion: prismaData.diente.fecha_creacion,
        fechaActualizacion: prismaData.diente.fecha_actualizacion,
      };
    }

    if (prismaData.superficie_dental) {
      hallazgoPaciente.superficieDental = {
        id: prismaData.superficie_dental.id,
        configuracionSuperficieId:
          prismaData.superficie_dental.configuracionSuperficieId,
        fila: prismaData.superficie_dental.fila,
        columna: prismaData.superficie_dental.columna,
        codigo: prismaData.superficie_dental.codigo,
        caraAnatomica: prismaData.superficie_dental.cara_anatomica,
        ubicacionEspecifica: prismaData.superficie_dental.ubicacion_especifica,
        esActiva: prismaData.superficie_dental.es_activa,
        descripcion: prismaData.superficie_dental.descripcion,
        fechaCreacion: prismaData.superficie_dental.fecha_creacion,
        fechaActualizacion: prismaData.superficie_dental.fecha_actualizacion,
      };
    }

    if (prismaData.hallazgo) {
      hallazgoPaciente.hallazgo = this.toHallazgoDomain(prismaData.hallazgo);
    }

    return hallazgoPaciente;
  }

  /**
   * Convierte array de Hallazgo de Prisma a entidades.
   */
  toHallazgoArray(prismaArray: any[]): HallazgoEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toHallazgoDomain(item))
      .filter(Boolean);
  }

  /**
   * Convierte array de HallazgoPaciente de Prisma a entidades.
   */
  toHallazgoPacienteArray(prismaArray: any[]): HallazgoPacienteEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toHallazgoPacienteDomain(item))
      .filter(Boolean);
  }

  /**
   * Convierte array de HallazgoPaciente con relaciones de Prisma a entidades.
   */
  toHallazgoPacienteArrayWithRelations(
    prismaArray: any[],
  ): HallazgoPacienteEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toHallazgoPacienteDomainWithRelations(item))
      .filter(Boolean);
  }

  /**
   * Convierte conteos agrupados de Prisma a formato de dominio.
   */
  toConteosPorTipo(prismaGroupBy: any[]): { [tipo: string]: number } {
    const conteos: { [tipo: string]: number } = {};

    if (!prismaGroupBy || !Array.isArray(prismaGroupBy)) {
      return conteos;
    }

    prismaGroupBy.forEach((item) => {
      if (item.nombre_hallazgo && item._count) {
        conteos[item.nombre_hallazgo] = item._count.id || item._count;
      }
    });

    return conteos;
  }

  /**
   * Convierte estadísticas de hallazgos más comunes.
   */
  toHallazgosMasComunes(
    prismaGroupBy: any[],
  ): { hallazgo: string; count: number }[] {
    if (!prismaGroupBy || !Array.isArray(prismaGroupBy)) {
      return [];
    }

    return prismaGroupBy
      .map((item) => ({
        hallazgo: item.nombre_hallazgo || 'Desconocido',
        count: item._count?.id || item._count || 0,
      }))
      .filter((item) => item.count > 0);
  }
}
