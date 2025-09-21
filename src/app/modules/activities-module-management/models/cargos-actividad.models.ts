import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

export interface CargoActividad {
  oidCargoActividad: number;
  nombre: string;
  tipo: string;
  maxHorasSemana: number;
  oidTipoActividad: number;
  nombreTipoActividad: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

// Filtros para búsqueda y paginación
export interface CargoActividadFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombre?: string;

  // Filtros específicos
  tipo?: string;
  oidTipoActividad?: number;
  nombreTipoActividad?: string;

  // Filtros por rango de horas
  maxHorasSemanaMin?: number;
  maxHorasSemanaMax?: number;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Filtros por usuario
  usuarioCreacion?: string;
  usuarioActualizacion?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateCargoActividadDTO {
  nombre: string;
  tipo: string;
  maxHorasSemana: number;
  oidTipoActividad: number;
}

export interface UpdateCargoActividadDTO
  extends Partial<CreateCargoActividadDTO> {
  oidCargoActividad: number;
}

export interface DeleteCargoActividadDTO {
  oidCargoActividad: number;
}

// Tipos de respuesta API
export type CargosActividadListResponse = BaseResponse<
  PaginatedResponse<CargoActividad>
>;
export type GetCargoActividadResponse = BaseResponse<CargoActividad>;
export type CreateCargoActividadResponse = BaseResponse<CargoActividad>;
export type UpdateCargoActividadResponse = BaseResponse<CargoActividad>;
export type DeleteCargoActividadResponse = BaseResponse<boolean>;

// Enums/constantes para valores comunes
export const TIPOS_CARGO = {
  PROFESOR: 'PROFESOR',
  ADMINISTRATIVO: 'ADMINISTRATIVO',
} as const;

export type TipoCargo = (typeof TIPOS_CARGO)[keyof typeof TIPOS_CARGO];
