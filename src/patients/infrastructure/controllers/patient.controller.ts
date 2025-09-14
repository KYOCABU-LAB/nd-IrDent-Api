// patients/infrastructure/controllers/patient.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PatientService } from 'src/patients/application/services/patient.service';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';

// ✅ Después
import type { PaginationFilters } from 'src/shared/types/paginated.interface';



@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Post()
  async create(@Body() data: CreatePatientDto): Promise<PatientResponseDto> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
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
  async findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.service.findById(Number(id));
  }

  @Get()
  async list( q: PaginationFilters) {
    return this.service.list(q);
  }
}
