import { Injectable } from '@nestjs/common';
import { HallazgoRepository } from '../../domain/repositories/hallazgo.repository';
import {
  HallazgoEntity,
  HallazgoPacienteEntity,
  TipoHallazgo,
} from '../../domain/entities/hallazgo.entity';
import { HallazgoMapper } from '../../application/mappers/hallazgo.mapper';
import { PrismaService } from '../../../shared/prisma/prisma.service';

/**
 * Implementación del repositorio de hallazgos usando Prisma ORM.
 *
 * Esta clase implementa todas las operaciones definidas en HallazgoRepository
 * utilizando Prisma como ORM para interactuar con la base de datos MySQL.
 *
 * @class PrismaHallazgoRepository
 * @extends {HallazgoRepository}
 * @author Rfs
 * @version 1.0.0
 */
@Injectable()
export class PrismaHallazgoRepository extends HallazgoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: HallazgoMapper,
  ) {
    super();
  }

  async findAllHallazgos(): Promise<HallazgoEntity[]> {
    const hallazgos = await this.prisma.hallazgos.findMany({
      orderBy: { nombre_hallazgo: 'asc' },
    });
    return this.mapper.toHallazgoArray(hallazgos);
  }

  async findHallazgoById(id: number): Promise<HallazgoEntity | null> {
    const hallazgo = await this.prisma.hallazgos.findUnique({
      where: { id },
    });
    return this.mapper.toHallazgoDomain(hallazgo);
  }

  async findHallazgosByTipo(tipo: TipoHallazgo): Promise<HallazgoEntity[]> {
    const hallazgos = await this.prisma.hallazgos.findMany({
      where: { tipo_hallazgo: tipo },
      orderBy: { nombre_hallazgo: 'asc' },
    });
    return this.mapper.toHallazgoArray(hallazgos);
  }

  async createHallazgo(
    hallazgo: Partial<HallazgoEntity>,
  ): Promise<HallazgoEntity> {
    const created = await this.prisma.hallazgos.create({
      data: this.mapper.toHallazgoPrisma(hallazgo),
    });
    return this.mapper.toHallazgoDomain(created);
  }

  async updateHallazgo(
    id: number,
    hallazgo: Partial<HallazgoEntity>,
  ): Promise<HallazgoEntity> {
    const updated = await this.prisma.hallazgos.update({
      where: { id },
      data: this.mapper.toHallazgoPrisma(hallazgo),
    });
    return this.mapper.toHallazgoDomain(updated);
  }

  async deleteHallazgo(id: number): Promise<void> {
    await this.prisma.hallazgos.delete({
      where: { id },
    });
  }

  async findHallazgoPacienteById(
    id: number,
  ): Promise<HallazgoPacienteEntity | null> {
    const hallazgo = await this.prisma.hallazgosPaciente.findUnique({
      where: { id },
    });
    return this.mapper.toHallazgoPacienteDomain(hallazgo);
  }

  async createHallazgoPaciente(
    hallazgo: Partial<HallazgoPacienteEntity>,
  ): Promise<HallazgoPacienteEntity> {
    const created = await this.prisma.hallazgosPaciente.create({
      data: this.mapper.toHallazgoPacientePrisma(hallazgo),
    });
    return this.mapper.toHallazgoPacienteDomain(created);
  }

  async updateHallazgoPaciente(
    id: number,
    hallazgo: Partial<HallazgoPacienteEntity>,
  ): Promise<HallazgoPacienteEntity> {
    const updated = await this.prisma.hallazgosPaciente.update({
      where: { id },
      data: this.mapper.toHallazgoPacientePrisma(hallazgo),
    });
    return this.mapper.toHallazgoPacienteDomain(updated);
  }

  async deleteHallazgoPaciente(id: number): Promise<void> {
    await this.prisma.hallazgosPaciente.delete({
      where: { id },
    });
  }

  async findHallazgosByPaciente(
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: { id_paciente: pacienteId },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosByPacienteYDiente(
    pacienteId: number,
    dienteId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: {
        id_paciente: pacienteId,
        id_diente: dienteId,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosByPacienteYSuperficie(
    pacienteId: number,
    superficieId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: {
        id_paciente: pacienteId,
        id_superficie_dental: superficieId,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosByDiente(
    dienteId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: { id_diente: dienteId },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosBySuperficie(
    superficieId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: { id_superficie_dental: superficieId },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosByDoctor(
    doctorId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: { id_doctor: doctorId },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosByDoctorYPaciente(
    doctorId: number,
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: {
        id_doctor: doctorId,
        id_paciente: pacienteId,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArray(hallazgos);
  }

  async findHallazgosWithDetails(
    pacienteId: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: { id_paciente: pacienteId },
      include: {
        diente: true,
        superficie_dental: true,
        hallazgo: true,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
    return this.mapper.toHallazgoPacienteArrayWithRelations(hallazgos);
  }

  async findHallazgoWithDetails(
    id: number,
  ): Promise<HallazgoPacienteEntity | null> {
    const hallazgo = await this.prisma.hallazgosPaciente.findUnique({
      where: { id },
      include: {
        diente: true,
        superficie_dental: true,
        hallazgo: true,
      },
    });
    return this.mapper.toHallazgoPacienteDomainWithRelations(hallazgo);
  }

  async existsHallazgoById(id: number): Promise<boolean> {
    const count = await this.prisma.hallazgos.count({
      where: { id },
    });
    return count > 0;
  }

  async existsHallazgoPacienteById(id: number): Promise<boolean> {
    const count = await this.prisma.hallazgosPaciente.count({
      where: { id },
    });
    return count > 0;
  }

  async hasHallazgoEnSuperficie(
    pacienteId: number,
    superficieId: number,
  ): Promise<boolean> {
    const count = await this.prisma.hallazgosPaciente.count({
      where: {
        id_paciente: pacienteId,
        id_superficie_dental: superficieId,
      },
    });
    return count > 0;
  }

  async countHallazgosByTipo(): Promise<{ [tipo: string]: number }> {
    const result = await this.prisma.hallazgosPaciente.groupBy({
      by: ['id_hallazgo'],
      _count: {
        id: true,
      },
    });

    const hallazgos = await this.prisma.hallazgos.findMany({
      select: {
        id: true,
        nombre_hallazgo: true,
      },
    });

    const hallazgoMap = new Map(
      hallazgos.map((h) => [h.id, h.nombre_hallazgo]),
    );
    const counts: { [tipo: string]: number } = {};

    result.forEach((item) => {
      const nombre = hallazgoMap.get(item.id_hallazgo);
      if (nombre) {
        counts[nombre] = item._count.id;
      }
    });

    return counts;
  }

  async countHallazgosByPaciente(pacienteId: number): Promise<number> {
    return this.prisma.hallazgosPaciente.count({
      where: { id_paciente: pacienteId },
    });
  }

  async getHallazgosMasComunes(
    limit: number = 10,
  ): Promise<{ hallazgo: string; count: number }[]> {
    const result = await this.prisma.hallazgosPaciente.groupBy({
      by: ['id_hallazgo'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    // nombre de hallazgos
    const hallazgoIds = result.map((r) => r.id_hallazgo);
    const hallazgos = await this.prisma.hallazgos.findMany({
      where: {
        id: { in: hallazgoIds },
      },
      select: {
        id: true,
        nombre_hallazgo: true,
      },
    });

    const hallazgoMap = new Map(
      hallazgos.map((h) => [h.id, h.nombre_hallazgo]),
    );

    return result.map((item) => ({
      hallazgo: hallazgoMap.get(item.id_hallazgo) || 'Desconocido',
      count: item._count.id,
    }));
  }

  async findHallazgosByDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    pacienteId?: number,
  ): Promise<HallazgoPacienteEntity[]> {
    const whereClause: any = {
      fecha_creacion: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    if (pacienteId) {
      whereClause.id_paciente = pacienteId;
    }

    const hallazgos = await this.prisma.hallazgosPaciente.findMany({
      where: whereClause,
      include: {
        diente: true,
        superficie_dental: true,
        hallazgo: true,
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return this.mapper.toHallazgoPacienteArrayWithRelations(hallazgos);
  }
}
