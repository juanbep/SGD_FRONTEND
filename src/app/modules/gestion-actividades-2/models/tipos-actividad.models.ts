import { BaseResponse, PaginatedResponse } from '../shared/shared.model';
import { TipoActividad } from './actividad.model';

export interface TipoActividadFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda
  searchTerm?: string;
  nombre?: string;
  descripcion?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para futuras operaciones CRUD (usando el patrón híbrido)
export interface CreateTipoActividadDto
  extends Omit<TipoActividad, 'oidTipoActividad'> {}

export interface UpdateTipoActividadDto
  extends Partial<CreateTipoActividadDto> {
  oidTipoActividad: number;
}

export interface DeleteTipoActividadDto {
  oidTipoActividad: number;
}

// Tipos de respuesta API
export type TiposActividadListResponse = BaseResponse<
  PaginatedResponse<TipoActividad>
>;
export type GetTipoActividadResponse = BaseResponse<TipoActividad>;
export type CreateTipoActividadResponse = BaseResponse<TipoActividad>;
export type UpdateTipoActividadResponse = BaseResponse<TipoActividad>;
export type DeleteTipoActividadResponse = BaseResponse<boolean>;
