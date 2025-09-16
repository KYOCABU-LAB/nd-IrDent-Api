import { Injectable } from "@nestjs/common";
import { DoctorRepository } from "src/doctors/domain/repositories/doctor.interface";
import { UserService } from "src/identity/application/services/user.service";
import { Doctor } from "../dto/doctor";

@Injectable()
export class RegisterDoctorService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
    private readonly userService: UserService,
  ) {}

  async registerDoctorWithUser(data: Doctor & { password: string; roleName: string }) {
    // 1. Crear el User
    const user = await this.userService.createUser({
      username: data.email, // o data.numero_documento
      password: data.password,
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido_paterno,
      telefono: data.telefono,
      roleName: data.roleName,
    });

    // 2. Crear el Doctor con el user_id recién creado
    const doctorData: Doctor = {
        numero_documento: data.numero_documento,
        user_id: user.id,
        tipo_documento: data.tipo_documento,
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        telefono: data.telefono,
        email: data.email,
        especialidad: data.especialidad,
        estado: data.estado,
    };

    return this.doctorRepository.createDoctor(doctorData);
  }
}
