/**
 * Información de ordenamiento
 */
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

/**
 * Información de paginación
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

/**
 * Respuesta paginada genérica del backend (Spring Data Page)
 */
export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}
