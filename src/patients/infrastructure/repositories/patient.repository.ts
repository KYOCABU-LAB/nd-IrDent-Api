import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma';
import type {
  CreatePatientDto,
  UpdatePatientDto,
  PatientResponseDto,
  CreatePatientWithRelationsDto,
} from 'src/patients/application/dto/patient';
import type { CreateContactDto, UpdateContactDto } from 'src/patients/application/dto/contact.dto';
import type { CreateAddressDto, UpdateAddressDto } from 'src/patients/application/dto/address.dto';
import { PatientRepository, type PatientListFilters } from 'src/patients/domain/repositories/patient.interface';

@Injectable()
class PatientRepositoryImpl extends PatientRepository {
/**
 * Constructor for the PatientRepositoryImpl class.
 * @param {PrismaClient} prisma - The PrismaClient instance.
 */
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  /**
   * Crea un paciente nuevo.
   * @param {CreatePatientWithRelationsDto} data - Los datos del paciente a crear.
   * @returns {Promise<PatientResponseDto>} - El paciente creado.
   */
  async create(data: CreatePatientWithRelationsDto): Promise<PatientResponseDto> {
    const { contactos, direcciones, ...p } = data;

    const payload: Prisma.PacienteCreateInput = {
      ...p,
      fecha_nacimiento:
        typeof p.fecha_nacimiento === 'string'
          ? new Date(p.fecha_nacimiento)
          : p.fecha_nacimiento,
      ...(contactos && contactos.length
        ? { ContactoPaciente: { create: contactos.map(c => ({ ...c })) } }
        : {}),
      ...(direcciones && direcciones.length
        ? { DireccionPaciente: { create: direcciones.map(d => ({ ...d })) } }
        : {}),
    };

    const created = await this.prisma.paciente.create({ data: payload });
    return created as unknown as PatientResponseDto;
  }

  /**
   * Actualiza un paciente existente en la base de datos con los datos proporcionados.
   * @param {number} id - id del paciente a actualizar
   * @param {UpdatePatientDto} data - datos del paciente a actualizar
   * @returns - promesa que se resuelve con el paciente actualizado
   * @throws {NotFoundError} - si el paciente no existe en la base de datos
   */
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

  /**
   * Elimina un paciente de la base de datos por su id.
   * @param {number} id - id del paciente a eliminar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la eliminación
   * @throws {NotFoundError} - si el paciente no existe en la base de datos
   */
  async delete(id: number): Promise<void> {
    await this.prisma.paciente.delete({ where: { id } });
  }

  /**
   * Clears all patients from the database.
   * @returns A promise with the number of patients deleted
   */
  async clearAll(): Promise<number> {
    const res = await this.prisma.paciente.deleteMany();
    return res.count;
  }

  /**
   * Finds a patient by id
   * @param id The id of the patient to find
   * @returns A promise with the found patient or null if the patient does not exist
   */
  async findById(id: number): Promise<PatientResponseDto | null> {
    const p = await this.prisma.paciente.findUnique({
      where: { id },
    });
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

  /**
   * Obtiene una lista de pacientes paginados
   * @param {Object} params - objeto que contiene los parámetros de búsqueda
   * @param {number} params.skip - número de pacientes a saltar
   * @param {number} params.take - número de pacientes a obtener
   * @param {PatientListFilters} [params.filters] - objeto que contiene los filtros de búsqueda
   * @returns {Promise<{ data: PatientResponseDto[]; total: number }>} - lista de pacientes encontrados y el total de pacientes encontrados
   */
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

  /**
   * Agrega un contacto a un paciente existente en la base de datos.
   * @param {number} pacienteId - id del paciente al que se le agrega el contacto
   * @param {CreateContactDto} data - datos del contacto a agregar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la agregación
   * @throws {NotFoundError} - si el paciente no existe en la base de datos
   */
  async addContact(pacienteId: number, data: CreateContactDto): Promise<void> {
    await this.prisma.contactoPaciente.create({
      data: { ...data, pacienteId },
    });
  }

  /**
   * Actualiza un contacto existente en la base de datos.
   * @param {number} pacienteId - id del paciente al que se le actualiza el contacto
   * @param {number} contactoId - id del contacto a actualizar
   * @param {UpdateContactDto} data - datos del contacto a actualizar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la actualización
   * @throws {Error} - si el contacto no existe en la base de datos
   */
  async updateContact(pacienteId: number, contactoId: number, data: UpdateContactDto): Promise<void> {
    // asegura pertenencia
    const exists = await this.prisma.contactoPaciente.findFirst({
      where: { id: contactoId, pacienteId },
      select: { id: true },
    });
    if (!exists) throw new Error('CONTACT_NOT_FOUND');

    await this.prisma.contactoPaciente.update({
      where: { id: contactoId },
      data,
    });
  }

  /**
   * Elimina un contacto de un paciente existente en la base de datos.
   * @param {number} pacienteId - id del paciente al que se le elimina el contacto
   * @param {number} contactoId - id del contacto a eliminar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la eliminación
   * @throws {Error} - si el contacto no existe en la base de datos
   */
  async deleteContact(pacienteId: number, contactoId: number): Promise<void> {
    // asegura pertenencia
    const exists = await this.prisma.contactoPaciente.findFirst({
      where: { id: contactoId, pacienteId },
      select: { id: true },
    });
    if (!exists) throw new Error('CONTACT_NOT_FOUND');

    await this.prisma.contactoPaciente.delete({ where: { id: contactoId } });
  }

  /**
   * Agrega una dirección a un paciente existente en la base de datos.
   * @param {number} pacienteId - id del paciente al que se le agrega la dirección
   * @param {CreateAddressDto} data - datos de la dirección a agregar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la agregación
   * @throws {NotFoundError} - si el paciente no existe en la base de datos
   */
  async addAddress(pacienteId: number, data: CreateAddressDto): Promise<void> {
    await this.prisma.direccionPaciente.create({
      data: { ...data, pacienteId },
    });
  }

  /**
   * Actualiza una dirección existente en la base de datos.
   * @param {number} pacienteId - id del paciente al que se le actualiza la dirección
   * @param {number} direccionId - id de la dirección a actualizar
   * @param {UpdateAddressDto} data - datos de la dirección a actualizar
   * @returns {Promise<void>} - promesa que se resuelve con void cuando se completa la actualización
   * @throws {Error} - si la dirección no existe en la base de datos
   */
  async updateAddress(pacienteId: number, direccionId: number, data: UpdateAddressDto): Promise<void> {
    const exists = await this.prisma.direccionPaciente.findFirst({
      where: { id: direccionId, pacienteId },
      select: { id: true },
    });
    if (!exists) throw new Error('ADDRESS_NOT_FOUND');

    await this.prisma.direccionPaciente.update({
      where: { id: direccionId },
      data,
    });
  }

  /**
   * Deletes an address from the database.
   * @param {number} pacienteId - the id of the patient that owns the address
   * @param {number} direccionId - the id of the address to delete
   * @returns {Promise<void>} - a promise that resolves with void when the address is deleted
   * @throws {Error} - if the address does not exist in the database
   */
  async deleteAddress(pacienteId: number, direccionId: number): Promise<void> {
    const exists = await this.prisma.direccionPaciente.findFirst({
      where: { id: direccionId, pacienteId },
      select: { id: true },
    });
    if (!exists) throw new Error('ADDRESS_NOT_FOUND');

    await this.prisma.direccionPaciente.delete({ where: { id: direccionId } });
  }
}

export default PatientRepositoryImpl;
