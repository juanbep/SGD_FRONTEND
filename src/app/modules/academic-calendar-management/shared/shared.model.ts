import { EstadoCalendario } from "../models";

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


// ✅ Interface para parámetros de filtros
export interface FiltrosCalendario {
  page?: number;
  size?: number;
  estados?: EstadoCalendario[];
  anio?: string;
  periodo?: number;
  busqueda?: string;
  ordenPor?: 'anioCalendario' | 'observacion' | 'estado' | 'fechaCreacion';
  orden?: 'asc' | 'desc';
  fechaDesde?: string;
  fechaHasta?: string;
}
