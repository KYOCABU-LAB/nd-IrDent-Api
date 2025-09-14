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
  /**
   * Creates a new patient with the given data
   * @param data The data for the new patient
   * @returns A promise with the created patient
   */
  create(@Body() data: CreatePatientDto): Promise<PatientResponseDto> {
    return this.service.create(data);
  }

  @Put(':id')
  /**
   * Updates a patient with the given id and data
   * @param id The id of the patient to update
   * @param data The data to update the patient with
   * @returns A promise with the updated patient
   */
  update(@Param('id') id: string, @Body() data: UpdatePatientDto): Promise<PatientResponseDto> {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  /**
   * Removes a patient with the given id
   * @param id The id of the patient to remove
   * @returns A promise with an object containing a single property "ok" with value true if the patient was successfully removed
   */
  async remove(@Param('id') id: string): Promise<{ ok: true }> {
    await this.service.delete(Number(id));
    return { ok: true };
  }

  @Delete()
  /**
   * Clears all patients from the database
   * @returns A promise with an object containing a single property "deleted" with value the number of patients deleted
   */
  async clear(): Promise<{ deleted: number }> {
    const deleted = await this.service.clearAll();
    return { deleted };
  }

  @Get(':id')
  /**
   * Finds a patient by id
   * @param id The id of the patient to find
   * @returns A promise with the found patient
   */
  findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.service.findById(Number(id));
  }

  @Get()

  /**
   * Retrieves a list of patients based on the given query
   * @param q The query for the list of patients
   * @returns A promise with the list of patients
   */
  list(@Query() q: PatientListQuery) {
    return this.service.list(q);
  }
}
