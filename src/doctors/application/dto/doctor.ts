export interface Doctor{
    numero_documento: string;
    user_id:number;
    tipo_documento: 'DNI' | 'CARNETE_EXTRANJERIA' | 'OTRO' | 'PASAPORTE';
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    telefono: string;
    email: string;
    especialidad: string;
    estado: 'ACTIVO' | 'INACTIVO';
    //fecha_creacion: Date;
    //fecha_actualizacion: Date;
}
export interface DoctorResponseDto{
    id: number;
    numero_documento: string;
    user_id:number;
    tipo_documento: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    telefono: string;
    email: string;
    especialidad: string;
    estado: string | null;
}