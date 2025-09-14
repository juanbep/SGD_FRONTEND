import { PaginatedResponse, BaseResponse } from '../shared/shared.model';

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
  fechas?: any | null; // Definir interface
}

export type EstadoCalendario =
  | 'ACTIVO'
  | 'DESHABILITADO'
  | 'APROBADO'
  | 'PENDIENTE';

export interface CrearCalendario {
  anioCalendario: string;
  numeroCalendario: number;
  observacion?: string;
}

export interface ActualizarCalendario {
  anioCalendario?: string;
  estado?: EstadoCalendario;
  semanasClase?: number;
  numeroCalendario?: number;
  observacion?: string;
}

export interface CalendarioResponse extends PaginatedResponse<Calendario> {}
export interface CalendarioItemResponse extends BaseResponse<Calendario> {}
