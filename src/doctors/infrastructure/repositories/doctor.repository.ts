import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import type {
  Doctor,
  DoctorResponseDto,
} from 'src/doctors/application/dto/doctor';
import { DoctorRepository } from 'src/doctors/domain/repositories/doctor.interface';

@Injectable()
export class DoctorRepositoryImpl extends DoctorRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async createDoctor(data: Doctor): Promise<DoctorResponseDto> {
    try {
      return await this.prisma.doctor.create({
        data: {
          numero_documento: data.numero_documento,
          user_id: data.user_id,
          tipo_documento: data.tipo_documento,
          nombre: data.nombre,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
          telefono: data.telefono,
          email: data.email,
          especialidad: data.especialidad,
          estado: data.estado,
        },
      });
    } catch (error) {
      throw new Error(`Error al crear Doctor: ${error.message}`);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email },
    });
    return !!doctor;
  }

  async existsByNumeroDocumento(numero_documento: string): Promise<boolean> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { numero_documento },
    });
    return !!doctor;
  }

  async findById(id: number): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (!doctor) {
      throw new Error(`Doctor con id ${id} no encontrado`);
    }
    return doctor;
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    return this.prisma.doctor.findMany();
  }

  async updateDoctor(id: number, data: Partial<Doctor>): Promise<DoctorResponseDto> {
    try {
      return await this.prisma.doctor.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Error al actualizar Doctor con id ${id}: ${error.message}`);
    }
  }

  async deleteDoctor(id: number): Promise<void> {
    try {
      await this.prisma.doctor.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Error al eliminar Doctor con id ${id}: ${error.message}`);
    }
  }
}

export default DoctorRepositoryImpl;
