import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface Departamento {
  oidDepartamento: number;
  nombre: string;
  facultad: string;
  jefeOidUsuario: number;
  jefeNombre: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
}

// Filtros para búsqueda y paginación
export interface DepartamentoFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombre?: string;
  facultad?: string;

  // Filtros específicos
  jefeOidUsuario?: number;
  jefeNombre?: string;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreateDepartamentoDto {
  nombre: string;
  facultad: string;
  jefeOidUsuario: number;
}

export interface UpdateDepartamentoDto extends Partial<CreateDepartamentoDto> {
  oidDepartamento: number;
}

export interface DeleteDepartamentoDto {
  oidDepartamento: number;
}

// Tipos de respuesta API
export type DepartamentosListResponse = BaseResponse<
  PaginatedResponse<Departamento>
>;
export type GetDepartamentoResponse = BaseResponse<Departamento>;
export type CreateDepartamentoResponse = BaseResponse<Departamento>;
export type UpdateDepartamentoResponse = BaseResponse<Departamento>;
export type DeleteDepartamentoResponse = BaseResponse<boolean>;
