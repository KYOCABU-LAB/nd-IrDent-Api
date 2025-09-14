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

  // 👇 Firma y lógica alineadas con la interface (sin q, con filters)
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
