import { DoctorRepository } from "src/doctors/domain/repositories/doctor.interface";
import { Doctor, DoctorResponseDto } from "../dto/doctor";
import { DoctorValidator } from "src/doctors/domain/validators/doctor.validator";
import { 
  EmailAlreadyExistsException, 
  EmailException   
} from "../exceptions/EmailExeption";
import { 
  NumDocException,
  NumDocAlreadyExistsException 
} from "../exceptions/NumDocExeption";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async createDoctor(data: Doctor): Promise<DoctorResponseDto> {
    //VALIDAR EMAIL
    if (!DoctorValidator.validateEmail(data.email)) {
      throw new EmailException('El Email no es valido');
    }
    const exists = await this.doctorRepository.existsByEmail(data.email);
    if (exists) {
      throw new EmailAlreadyExistsException();
    }
    //VALIDAR NUMERO DOCUMENTO
    if (!DoctorValidator.validateNumeroDocumento(data.numero_documento)) {
      throw new NumDocException('El Numero de Documento no es valido');
    }
    const docExists = await this.doctorRepository.existsByNumeroDocumento(data.numero_documento);
    if (docExists) {
      throw new NumDocAlreadyExistsException();
    }
    return this.doctorRepository.createDoctor(data);
  }
  
  //OBTENER DOCTOR POR ID
  async getDoctorById(id: number): Promise<DoctorResponseDto> {
    return this.doctorRepository.findById(id);
  }
  //OBTENER TODOS LOS DOCTORES
  async getAllDoctors(): Promise<DoctorResponseDto[]> {
    return this.doctorRepository.findAll();
  }
  //ACTUALIZAR DOCTOR
  async updateDoctor(id: number, data: Partial<Doctor>): Promise<DoctorResponseDto> {
    return this.doctorRepository.updateDoctor(id, data);
  }
  //ELIMINAR DOCTOR
  async deleteDoctor(id: number): Promise<void> {
    return this.doctorRepository.deleteDoctor(id);
  }
}