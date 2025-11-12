export interface BaseResponse<T = any> {
  codigo: number;
  mensaje: string;
  data: T;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  pageSizeOptions: number[];
}

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  currentPage: 0,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
  pageSizeOptions: [5, 10, 20, 50]
};

