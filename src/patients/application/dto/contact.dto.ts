export interface CreateContactDto {
  nombre: string;
  telefono: string;
  relacion: string;
}

export interface UpdateContactDto {
  nombre?: string;
  telefono?: string;
  relacion?: string;
}

