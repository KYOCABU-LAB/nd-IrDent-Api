import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import type {
  Doctor,
  DoctorResponseDto,
} from 'src/doctors/application/dto/doctor';
import { DoctorRepository } from 'src/doctors/domain/repositories/doctor.interface';

@Injectable()
class DoctorRepositoryImpl extends DoctorRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async createDoctor(data: Doctor): Promise<DoctorResponseDto> {
    try{
        return await this.prisma.doctor.create({
      data:{
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
      }
    });
    }catch (error) {
      throw new Error(`error: ${error.message}`);
    }
    
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.doctor.findUnique({
      where: { email },
    });
    return !!user;
  }

  async existsByNumeroDocumento(numero_documento: string): Promise<boolean> {
    const documento = await this.prisma.doctor.findUnique({
      where: { numero_documento },
    });
    return !!documento;
  }

}

export default DoctorRepositoryImpl;
