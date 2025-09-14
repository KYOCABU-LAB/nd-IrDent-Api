import { Paciente, PrismaClient } from 'generated/prisma';
import { Paginated, PaginationFilters } from './paginated.interface';

export class userController {
  constructor(private readonly ser: Service) {}

  async BuscarPorNombre(
    filtros: PaginationFilters<userFiltros>,
  ): Promise<Paginated<Paciente>> {
    return this.ser.BuscarPorNombre(filtros);
  }
}

export class Service {
  constructor(private readonly prisma: PrismaClient) {}

  async BuscarPorNombre(
    filtros: PaginationFilters<userFiltros>,
  ): Promise<Paginated<Paciente>> {
    const { page, size, filters } = filtros;
    const nombre = filters?.nombre;
    const document = filters?.document;
    const edad = filters?.edad;

    const resultado = await this.prisma.paciente.findMany({
      where: {
        nombre: {
          contains: nombre,
        },
        numero_documento: {
          equals: document,
        },
      },
    });

    return {
      content: resultado,
      totalElements: resultado.length,
      totalPages: 1,
      page: page || 1,
      size: size || 10,
      isNext: false,
      isPrev: false,
    };
  }
}

interface userFiltros {
  nombre: string;
  document: string;
  edad: number;
}
