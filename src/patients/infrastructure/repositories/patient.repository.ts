// patients/infrastructure/repositories/patient.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';
import { PatientRepository } from 'src/patients/domain/repositories/patient.interface';

@Injectable()
class PatientRepositoryImpl extends PatientRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

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

  async delete(id: number): Promise<void> {
    await this.prisma.paciente.delete({ where: { id } });
  }

  async clearAll(): Promise<number> {
    const res = await this.prisma.paciente.deleteMany();
    return res.count;
  }

  async findById(id: number): Promise<PatientResponseDto | null> {
    const p = await this.prisma.paciente.findUnique({ where: { id } });
    return (p as unknown as PatientResponseDto) ?? null;
  }

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

  async list(params: {
    skip: number;
    take: number;
    q?: string;
  }): Promise<{ data: PatientResponseDto[]; total: number }> {
    const skip = Number(params?.skip ?? 0);
    const take = Math.min(Number(params?.take ?? 10), 100);
    const q = params?.q?.trim();

    const where: Prisma.PacienteWhereInput = q
      ? {
          OR: [
            { nombre: { contains: q } },
            { apellido_paterno: { contains: q } },
            { apellido_materno: { contains: q } },
            { numero_documento: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.paciente.findMany({
        where,
        orderBy: { fecha_creacion: 'desc' },
        skip,
        take,
      }),
      this.prisma.paciente.count({ where }),
    ]);

    return { data: data as unknown as PatientResponseDto[], total };
  }
}

export default PatientRepositoryImpl;
