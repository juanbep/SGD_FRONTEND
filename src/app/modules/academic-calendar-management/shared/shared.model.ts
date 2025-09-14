export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Estructura response genérica
export interface BaseResponse<T> {
  codigo: number;
  mensaje: string;
  data: T;
}

// Estructura paginator response genérica
export interface PaginatedResponse<T> {
  codigo: number;
  mensaje: string;
  data: {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}
