import { LoggerService, LogLevel } from '@nestjs/common';

/**
 * Configuración personalizada del logger para la aplicación
 */
export class CustomLogger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * Escribe un mensaje de log de nivel 'log'
   */
  log(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    console.log(`[${timestamp}] [LOG] [${ctx}] ${message}`);
  }

  /**
   * Escribe un mensaje de log de nivel 'error'
   */
  error(message: any, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    console.error(`[${timestamp}] [ERROR] [${ctx}] ${message}`);
    if (trace) {
      console.error(`[${timestamp}] [ERROR] [${ctx}] Stack trace: ${trace}`);
    }
  }

  /**
   * Escribe un mensaje de log de nivel 'warn'
   */
  warn(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    console.warn(`[${timestamp}] [WARN] [${ctx}] ${message}`);
  }

  /**
   * Escribe un mensaje de log de nivel 'debug'
   */
  debug(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const ctx = context || this.context || 'Application';
      console.debug(`[${timestamp}] [DEBUG] [${ctx}] ${message}`);
    }
  }

  /**
   * Escribe un mensaje de log de nivel 'verbose'
   */
  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const ctx = context || this.context || 'Application';
      console.log(`[${timestamp}] [VERBOSE] [${ctx}] ${message}`);
    }
  }

  /**
   * Establece los niveles de log
   */
  setLogLevels(levels: LogLevel[]) {}
}

/**
 * Configuración de niveles de log según el entorno
 */
export const getLogLevels = (): LogLevel[] => {
  if (process.env.NODE_ENV === 'production') {
    return ['error', 'warn', 'log'];
  }
  return ['error', 'warn', 'log', 'debug', 'verbose'];
};
