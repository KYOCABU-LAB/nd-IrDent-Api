export class DoctorValidator {
  static validateNumeroDocumento(numero_documento: string): boolean {
    if (!numero_documento || typeof numero_documento !== 'string') {
      return false;
    }
    return /^[0-9]{8,12}$/.test(numero_documento);
  }
  static validateTipoDocumento(tipo_documento: string): boolean {
    if (!tipo_documento || typeof tipo_documento !== 'string') {
      return false;
    }
    return ['DNI', 'CARNETE_EXTRANJERIA', 'OTRO', 'PASAPORTE'].includes(tipo_documento);
  }
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0;
  }
  static validateEstado(estado: string): boolean {
    if (!estado || typeof estado !== 'string') {
      return false;
    }
    return ['ACTIVO', 'INACTIVO'].includes(estado);
  }
}