export type PatientFilterFields = {
  nombre?: string;
  numero_documento?: string;
  email?: string;
};

import type { PaginationFilters } from 'src/shared/types/paginated.interface';
export type PatientListQuery = PaginationFilters<PatientFilterFields>;
