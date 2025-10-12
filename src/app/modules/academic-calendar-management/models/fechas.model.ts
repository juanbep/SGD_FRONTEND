import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface Fecha {
  oidFecha: number;
  oidNombreFecha: number;
  nombre: string;
  fechaInicial: string;
  fechaFin: string;
  tipo: TipoFecha;
  oidCalendario: number;
  nombreCalendario: string;
}

export type TipoFecha =
  | 'RESALTADAS'
  | 'CLASES'
  | 'NO_RESALTADAS'
  | 'ADMINISTRATIVAS';

// Filtros para búsqueda y paginación
export interface FechaFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombre?: string;

  // Filtros específicos
  tipo?: TipoFecha;
  tipos?: TipoFecha[];
  oidCalendario?: number;
  nombreCalendario?: string;
  oidNombreFecha?: number;

  // Filtros por rangos de fecha
  fechaInicialDesde?: string;
  fechaInicialHasta?: string;
  fechaFinDesde?: string;
  fechaFinHasta?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreateFechaDto {
  fechaInicial: string;
  fechaFin: string;
  tipo: TipoFecha;
  oidNombreFecha: number;
  oidCalendario: number;
}

export interface UpdateFechaDto extends Partial<CreateFechaDto> {
  oidFecha: number;
}

export interface DeleteFechaDto {
  oidFecha: number;
}

// Tipos de respuesta API
export type FechasListResponse = BaseResponse<PaginatedResponse<Fecha>>;
export type GetFechaResponse = BaseResponse<Fecha>;
export type CreateFechaResponse = BaseResponse<Fecha>;
export type UpdateFechaResponse = BaseResponse<Fecha>;
export type DeleteFechaResponse = BaseResponse<boolean>;
