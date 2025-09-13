import { Controller, Post, Body } from '@nestjs/common';
import { DoctorService } from 'src/doctors/application/services/doctor.service';
import type {
  Doctor,
  DoctorResponseDto,
} from 'src/doctors/application/dto/doctor';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('/create')
  async createDoctor(@Body() data: Doctor): Promise<DoctorResponseDto> {
    return this.doctorService.createDoctor(data);
  }
}
