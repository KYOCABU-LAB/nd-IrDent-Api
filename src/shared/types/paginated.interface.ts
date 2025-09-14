/**
 * Interface para representar los filtros de paginación.
 */
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class PaginationFilters {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number;
}

/**
 * Interface para representar una página de resultados paginados.
 */
export interface Paginated<T> {
  content: T[]; // los registros de la página actual
  totalElements: number; // total de registros
  totalPages: number; // total de páginas
  page: number; // número de página actual
  size: number; // tamaño de página
  isNext: boolean; // si existe página siguiente
  isPrev: boolean; // si existe página anterior
}
