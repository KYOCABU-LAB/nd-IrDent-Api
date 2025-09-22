import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

/**
 * Servicio de Prisma para gestionar la conexión con la base de datos.
 *
 * Este servicio extiende PrismaClient y maneja el ciclo de vida de la conexión
 * con la base de datos MySQL, incluyendo la conexión automática al inicializar
 * el módulo y la desconexión al destruirlo.
 *
 * @class PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit, OnModuleDestroy}
 * @author Sistema IrDent
 * @version 1.0.0
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Se ejecuta cuando el módulo se inicializa.
   * Establece la conexión con la base de datos.
   */
  async onModuleInit() {
    await this.$connect();
    console.log('Conexión con base de datos establecida');
  }

  /**
   * Se ejecuta cuando el módulo se destruye.
   * Cierra la conexión con la base de datos.
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log(' Conexión con base de datos cerrada');
  }
}
