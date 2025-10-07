import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface Programa {
  oidPrograma: number;
  nombre: string;
  nombreCorto: string;
  coordinadorOidUsuario: number;
  coordinadorNombre: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
}

// Filtros para búsqueda y paginación
export interface ProgramaFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombre?: string;
  nombreCorto?: string;

  // Filtros específicos
  coordinadorOidUsuario?: number;
  coordinadorNombre?: string;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreateProgramaDto {
  nombre: string;
  nombreCorto: string;
  coordinadorOidUsuario: number;
}

export interface UpdateProgramaDto extends Partial<CreateProgramaDto> {
  oidPrograma: number;
}

export interface DeleteProgramaDto {
  oidPrograma: number;
}

// Tipos de respuesta API
export type ProgramasListResponse = BaseResponse<PaginatedResponse<Programa>>;
export type GetProgramaResponse = BaseResponse<Programa>;
export type CreateProgramaResponse = BaseResponse<Programa>;
export type UpdateProgramaResponse = BaseResponse<Programa>;
export type DeleteProgramaResponse = BaseResponse<boolean>;
