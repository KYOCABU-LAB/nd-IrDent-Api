import { Request } from 'express';

/**
 * Obtiene la IP del cliente de forma simple
 */
export function getClientIp(req: Request): string {
  if (req.ip === '::1') {
    return '127.0.0.1';
  }

  return req.ip || '127.0.0.1';
}
