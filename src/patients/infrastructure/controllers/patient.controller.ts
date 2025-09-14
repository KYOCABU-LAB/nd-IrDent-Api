// src/patients/infrastructure/controllers/patient.controller.ts
import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
} from '@nestjs/common';
import { PatientService } from 'src/patients/application/services/patient.service';
import type { CreatePatientDto, UpdatePatientDto, PatientResponseDto } from 'src/patients/application/dto/patient';
import type { PatientListQuery } from 'src/patients/application/dto/patient.list.types';

@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Post()
  create(@Body() data: CreatePatientDto): Promise<PatientResponseDto> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePatientDto): Promise<PatientResponseDto> {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ ok: true }> {
    await this.service.delete(Number(id));
    return { ok: true };
  }

  @Delete()
  async clear(): Promise<{ deleted: number }> {
    const deleted = await this.service.clearAll();
    return { deleted };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.service.findById(Number(id));
  }

  @Get()
  list(@Query() q: PatientListQuery) {
    return this.service.list(q);
  }
}
