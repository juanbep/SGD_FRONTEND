import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface Plan {
  oidPlan: number;
  numero: number;
  estado: EstadoPlan;
  fechaAprobacion: string;
  acuerdo: string;
  oidPrograma: number;
  nombrePrograma: string;
  cantidadMaterias?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioCreacion: string;
  usuarioActualizacion: string;
}

export type EstadoPlan = 'ACTIVO' | 'INACTIVO';

// Filtros para búsqueda y paginación
export interface PlanFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  numero?: number;
  acuerdo?: string;

  // Filtros específicos
  estado?: EstadoPlan;
  estados?: EstadoPlan[];
  oidPrograma?: number;
  nombrePrograma?: string;

  // Filtros por fechas
  fechaAprobacionDesde?: string;
  fechaAprobacionHasta?: string;
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Ordenamiento
  sort?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreatePlanDto {
  numero: number;
  estado: EstadoPlan;
  fechaAprobacion: string;
  acuerdo: string;
  oidPrograma: number;
  oidPlanBase?: number;
}

// UpdatePlanDto
export interface UpdatePlanDto {
  numero: number;
  estado: EstadoPlan;
  fechaAprobacion: string;
  acuerdo: string;
  oidPrograma: number;
  oidPlanBase?: number;
}

export interface DeletePlanDto {
  oidPlan: number;
}

// Tipos de respuesta API
export type PlanesListResponse = BaseResponse<PaginatedResponse<Plan>>;
export type GetPlanResponse = BaseResponse<Plan>;
export type CreatePlanResponse = BaseResponse<Plan>;
export type UpdatePlanResponse = BaseResponse<Plan>;
export type DeletePlanResponse = BaseResponse<boolean>;
