/**
 * Interface para representar los filtros de paginación.
 */
export interface PaginationFilters {
  page?: number; // página actual (default 1)
  size?: number; // cantidad por página (default 10)
  search?: string; // criterio de búsqueda
  sortBy?: string; // campo de ordenamiento
  sortOrder?: 'asc' | 'desc';
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
