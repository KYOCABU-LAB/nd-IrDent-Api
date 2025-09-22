import { Controller, Post, Body } from '@nestjs/common';
import { DoctorService } from 'src/doctors/application/services/doctor.service';
import type {
  Doctor,
  DoctorResponseDto,
} from 'src/doctors/application/dto/doctor';
import { RegisterDoctorService } from 'src/doctors/application/services/register-doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly registerDoctorService: RegisterDoctorService
  ) {}
  /* Crear SOLO Doctor 
  @Post('/create')
  async createDoctor(@Body() data: Doctor): Promise<DoctorResponseDto> {
    return this.doctorService.createDoctor(data);
  }
  */
 // Crear Doctor y User asociado
  @Post('register')
  async registerDoctor(@Body() body: Doctor & { password: string; roleName: string }) {
    return this.registerDoctorService.registerDoctorWithUser(body);
  }
}
