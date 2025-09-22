import { Injectable } from '@nestjs/common';
import { DienteEntity, TipoDiente } from '../../domain/entities/diente.entity';

/**
 * Mapper para convertir entre datos de Prisma y entidades de dominio para Dientes.
 * Maneja la conversión bidireccional y el mapeo de nombres de campos.
 */
@Injectable()
export class DienteMapper {
  /**
   * Convierte datos de Prisma a entidad de dominio.
   */
  toDomain(prismaData: any): DienteEntity {
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

  /**
   * Convierte entidad de dominio a formato Prisma para crear/actualizar.
   */
  toPrisma(entity: Partial<DienteEntity>): any {
    const prismaData: any = {};

    if (entity.numeroDiente !== undefined) {
      prismaData.numero_diente = entity.numeroDiente;
    }
    if (entity.nombreDiente !== undefined) {
      prismaData.nombre_diente = entity.nombreDiente;
    }
    if (entity.descripcion !== undefined) {
      prismaData.descripcion = entity.descripcion;
    }
    if (entity.edadDiente !== undefined) {
      prismaData.edad_diente = entity.edadDiente;
    }
    if (entity.tipoDiente !== undefined) {
      prismaData.tipo_diente = entity.tipoDiente;
    }

    return prismaData;
  }

  /**
   * Convierte datos de Prisma con relaciones incluidas.
   */
  toDomainWithRelations(prismaData: any): DienteEntity {
    const diente = this.toDomain(prismaData);

    // Mapear configuraciones si están incluidas
    if (prismaData.ConfiguracionDiente) {
      diente.configuraciones = prismaData.ConfiguracionDiente.map(
        (config: any) => ({
          id: config.id,
          dienteId: config.dienteId,
          configuracionSuperficieId: config.configuracionSuperficieId,
          fechaCreacion: config.fecha_creacion,
          fechaActualizacion: config.fecha_actualizacion,
        }),
      );
    }

    if (prismaData.hallazgos_paciente) {
      diente.hallazgos = prismaData.hallazgos_paciente.map((hallazgo: any) => ({
        id: hallazgo.id,
        idDiente: hallazgo.id_diente,
        idSuperficieDental: hallazgo.id_superficie_dental,
        idPaciente: hallazgo.id_paciente,
        idDoctor: hallazgo.id_doctor,
        idHallazgo: hallazgo.id_hallazgo,
        observaciones: hallazgo.observaciones,
        fechaCreacion: hallazgo.fecha_creacion,
        fechaActualizacion: hallazgo.fecha_actualizacion,
      }));
    }

    return diente;
  }

  /**
   * Convierte array de datos de Prisma a array de entidades.
   */
  toDomainArray(prismaArray: any[]): DienteEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray.map((item) => this.toDomain(item)).filter(Boolean);
  }

  /**
   * Convierte array de datos de Prisma con relaciones a array de entidades.
   */
  toDomainArrayWithRelations(prismaArray: any[]): DienteEntity[] {
    if (!prismaArray || !Array.isArray(prismaArray)) {
      return [];
    }

    return prismaArray
      .map((item) => this.toDomainWithRelations(item))
      .filter(Boolean);
  }
}
