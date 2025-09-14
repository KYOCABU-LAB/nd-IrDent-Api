import { EnumTipoDocumento } from 'generated/prisma';

export class PatientValidator {
  static isEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static isTelefono(tel: string): boolean {
    return !!tel && /^[0-9+\s()-]{6,20}$/.test(tel);
  }

  static isFecha(d: string | Date): boolean {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt instanceof Date && !isNaN(dt.getTime());
  }

  static docValido(doc: string, tipo?: EnumTipoDocumento): boolean {
    if (!doc) return false;
    if (tipo === 'DNI' || !tipo) return /^[0-9]{8}$/.test(doc);
    return doc.length >= 6; 
  }

  static nombreRequerido(n: string): boolean {
    return !!n && n.trim().length >= 2;
  }
}
