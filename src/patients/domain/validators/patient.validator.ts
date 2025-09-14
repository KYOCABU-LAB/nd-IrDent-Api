import { EnumTipoDocumento } from 'generated/prisma';

export class PatientValidator {
  /**
   * Valida si un string es un correo electrónico válido
   * @param email String con el correo electrónico a validar
   * @returns boolean True si el correo electrónico es válido, false en otro caso
   */
  static isEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Valida si un string es un teléfono válido
   * @param tel String con el teléfono a validar
   * @returns boolean True si el teléfono es válido, false en otro caso
   */
  static isTelefono(tel: string): boolean {
    return !!tel && /^[0-9+\s()-]{6,20}$/.test(tel);
  }

  /**
   * Valida si una fecha es válida
   * @param d String con la fecha en formato ISO o Date con la fecha a validar
   * @returns boolean True si la fecha es válida, false en otro caso
   */
  static isFecha(d: string | Date): boolean {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt instanceof Date && !isNaN(dt.getTime());
  }


  /**
   * Valida si un string es un documento válido
   * @param doc String con el documento a validar
   * @param tipo EnumTipoDocumento con el tipo de documento a validar
   * @returns boolean True si el documento es válido, false en otro caso
   */
  static docValido(doc: string, tipo?: EnumTipoDocumento): boolean {
    if (!doc) return false;
    if (tipo === 'DNI' || !tipo) return /^[0-9]{8}$/.test(doc);
    return doc.length >= 6; 
  }

  /**
   * Valida si un nombre es requerido
   * Un nombre es requerido si no es nulo y tiene al menos 2 caracteres
   * @param n String con el nombre a validar
   * @returns boolean True si el nombre es requerido, false en otro caso
   */
  static nombreRequerido(n: string): boolean {
    return !!n && n.trim().length >= 2;
  }
}
