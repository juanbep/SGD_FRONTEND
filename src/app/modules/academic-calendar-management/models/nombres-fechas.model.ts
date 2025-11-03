import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface NombreFecha {
  oidNombreFecha: number;
  nombre: string;
  uniqueDate: boolean,
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

// Filtros para búsqueda y paginación
export interface NombreFechaFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombre?: string;

  // Filtros por usuario
  usuarioCreacion?: string;
  usuarioActualizacion?: string;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Filtros especiales
  tieneTemplate?: boolean; // Para filtrar nombres con placeholders {calendar}, etc.

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreateNombreFechaDto {
  nombre: string;
}

export interface UpdateNombreFechaDto extends Partial<CreateNombreFechaDto> {
  oidNombreFecha: number;
}

export interface DeleteNombreFechaDto {
  oidNombreFecha: number;
}

// Tipos de respuesta API
export type NombresFechaListResponse = BaseResponse<
  PaginatedResponse<NombreFecha>
>;
export type GetNombreFechaResponse = BaseResponse<NombreFecha>;
export type CreateNombreFechaResponse = BaseResponse<NombreFecha>;
export type UpdateNombreFechaResponse = BaseResponse<NombreFecha>;
export type DeleteNombreFechaResponse = BaseResponse<boolean>;
