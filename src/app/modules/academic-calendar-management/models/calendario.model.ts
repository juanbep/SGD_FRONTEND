import { PaginatedResponse, BaseResponse } from '../shared/shared.model';
import { Fecha } from './fechas.model';

// Modelo principal
export interface Calendario {
  oidcalendario: number;
  anioCalendario: string;
  numeroCalendario: number;
  semanasClase?: number | null;
  semanasPreparacion?: number | null;
  horasPlanta?: number | null;
  horasCatedra?: number | null;
  horasOcasionales?: number | null;
  horasBecarioPracticante?: number | null;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
  estado: EstadoCalendario;
  observacion: string;
  fechas?: Fecha[];
}

export type EstadoCalendario =
  | 'ACTIVO'
  | 'DESHABILITADO'
  | 'APROBADO'
  | 'PENDIENTE';

// Filtros para búsqueda y paginación
export interface CalendarioFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  observacion?: string;

  // Filtros específicos
  anioCalendario?: string;
  numeroCalendario?: number;
  estado?: EstadoCalendario;
  estados?: EstadoCalendario[];

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs
export interface CreateCalendarioDTO {
  anioCalendario: string;
  numeroCalendario: number;
  observacion?: string; // Opcional para creación
}

export interface UpdateCalendarioDTO
  extends Partial<
    Omit<
      Calendario,
      | 'fechaCreacion'
      | 'usuarioCreacion'
      | 'fechaActualizacion'
      | 'usuarioActualizacion'
      | 'fechas'
    >
  > {
  oidcalendario: number;
}

export interface DeleteCalendarioDTO {
  oidcalendario: number;
}

// Tipos de respuesta API
export type CalendariosListResponse = BaseResponse<
  PaginatedResponse<Calendario>
>;
export type GetCalendarioResponse = BaseResponse<Calendario>;
export type CreateCalendarioResponse = BaseResponse<Calendario>;
export type UpdateCalendarioResponse = BaseResponse<Calendario>;
export type DeleteCalendarioResponse = BaseResponse<boolean>;
