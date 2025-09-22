export interface CreateAddressDto {
  calle: string;
  referencia: string;
  departamento: string;
  distrito: string;
  provincia: string;
  pais: string;
  nro_exterior: string;
}

export interface UpdateAddressDto {
  calle?: string;
  referencia?: string;
  departamento?: string;
  distrito?: string;
  provincia?: string;
  pais?: string;
  nro_exterior?: string;
}
