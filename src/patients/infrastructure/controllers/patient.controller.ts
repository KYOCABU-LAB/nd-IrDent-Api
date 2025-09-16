import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
} from '@nestjs/common';
import { PatientService } from 'src/patients/application/services/patient.service';
import type {
  CreatePatientWithRelationsDto,
  UpdatePatientDto,
  PatientResponseDto,
} from 'src/patients/application/dto/patient';
import type { PatientListQuery } from 'src/patients/application/dto/patient.list.types';
import type { CreateContactDto, UpdateContactDto } from 'src/patients/application/dto/contact.dto';
import type { CreateAddressDto, UpdateAddressDto } from 'src/patients/application/dto/address.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Post()
  /**
   * Crea un paciente nuevo.
   * @param {CreatePatientWithRelationsDto} data - datos del paciente a crear.
   * @returns {Promise<PatientResponseDto>} - promesa que se resuelve con el paciente creado.
   * @throws PatientInvalidDataException - si los datos del paciente son inválidos.
   * @throws PatientAlreadyExistsException - si el paciente ya existe en la base de datos.
   */
  create(@Body() data: CreatePatientWithRelationsDto): Promise<PatientResponseDto> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePatientDto): Promise<PatientResponseDto> {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  /**
   * Elimina un paciente de la base de datos por su id.
   * @param {string} id - id del paciente a eliminar.
   * @returns {Promise<{ ok: boolean }>} - promesa que se resuelve con { ok: true } cuando se completa la eliminación.
   * @throws {NotFoundError} - si el paciente no existe en la base de datos.
   */
  async remove(@Param('id') id: string) {
    await this.service.delete(Number(id));
    return { ok: true };
  }

  @Delete()
  /**
   * Elimina todos los pacientes de la base de datos.
   * @returns {Promise<{ deleted: number }>} - promesa que se resuelve con el número de pacientes eliminados.
   */
  async clear() {
    const deleted = await this.service.clearAll();
    return { deleted };
  }

  @Get(':id')
/**
 * Finds a patient by id
 * @param id The id of the patient to find
 * @returns A promise with the found patient or null if the patient does not exist
 */
  findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.service.findById(Number(id));
  }

  @Get()
/**
 * Obtiene una lista de pacientes paginados
 * @param {PatientListQuery} q - objeto que contiene los parámetros de búsqueda
 * @returns {Promise<{ data: PatientResponseDto[]; total: number }>} - lista de pacientes encontrados
 */
  list(@Query() q: PatientListQuery) {
    return this.service.list(q);
  }

  // ----- CONTACTOS -----
  @Post(':id/contacts')
  addContact(@Param('id') id: string, @Body() data: CreateContactDto) {
    return this.service.addContact(Number(id), data);
  }

  @Put(':id/contacts/:contactId')
  updateContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
    @Body() data: UpdateContactDto,
  ) {
    return this.service.updateContact(Number(id), Number(contactId), data);
  }

  @Delete(':id/contacts/:contactId')
  deleteContact(@Param('id') id: string, @Param('contactId') contactId: string) {
    return this.service.deleteContact(Number(id), Number(contactId));
  }

  // ----- DIRECCIONES -----
  @Post(':id/addresses')
  addAddress(@Param('id') id: string, @Body() data: CreateAddressDto) {
    return this.service.addAddress(Number(id), data);
  }

  @Put(':id/addresses/:addressId')
  updateAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() data: UpdateAddressDto,
  ) {
    return this.service.updateAddress(Number(id), Number(addressId), data);
  }

  @Delete(':id/addresses/:addressId')
  deleteAddress(@Param('id') id: string, @Param('addressId') addressId: string) {
    return this.service.deleteAddress(Number(id), Number(addressId));
  }
}
