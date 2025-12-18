import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Modelo principal
export interface Materia {
  idMateria: number;
  oidMateria: string;
  codigo: string;
  nombre: string;
  semestre: number;
  horasSemana: number;
  oidDepartamento: number;
  nombreDepartamento: string;
  oidPlan: number;
  numeroPlan: string;
  idCorrequisito: number | null;
  oidCorrequisito: string | null;
  nombreCorrequisito: string | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

// Filtros para búsqueda y paginación
export interface MateriaFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  oidMateria?: string;
  codigo?: string;
  nombre?: string;

  // Filtros específicos
  semestre?: number;
  oidDepartamento?: number;
  nombreDepartamento?: string;
  oidPlan?: number;
  numeroPlan?: string;

  // Filtros por horas
  horasSemanaMinimasDesde?: number;
  horasSemanaMinimasHasta?: number;

  // Filtros por correquisito
  tieneCorrequisito?: boolean;
  idCorrequisito?: number;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs para CRUD
export interface CreateMateriaDto {
  oidMateria: string;
  codigo: string;
  nombre: string;
  semestre: number;
  horasSemana: number;
  oidDepartamento: number;
  oidPlan: number;
  idCorrequisito?: number | null;
}

export interface UpdateMateriaDto
  extends Partial<Omit<CreateMateriaDto, 'oidMateria'>> {
  idMateria: number;
  oidmateria?: string;
}

export interface DeleteMateriaDto {
  idMateria: number;
}

// Tipos de respuesta API
export type MateriasListResponse = BaseResponse<PaginatedResponse<Materia>>;
export type GetMateriaResponse = BaseResponse<Materia>;
export type CreateMateriaResponse = BaseResponse<Materia>;
export type UpdateMateriaResponse = BaseResponse<Materia>;
export type DeleteMateriaResponse = BaseResponse<boolean>;
