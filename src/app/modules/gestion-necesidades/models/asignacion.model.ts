import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// ========== ASIGNACIÓN ==========

export interface AsignacionResponse {
  oidAsignacion: number;
  oidNecesidad: number;
  oidSeleccionado: number;
  oidActividad: number;
  horasDocencia: number;
  semanasDocencia: number;
  horasPreparacion: number;
  semanasPreparacion: number;
  nombreActividad: string;
  nombreDocente: string;
  codigoMateria: string;
  nombreMateria: string;
  grupo: string;
  numeroCalendario: number;
  anioCalendario: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
}

// ========== DTOs PARA CREAR/ACTUALIZAR ==========

export interface CreateAsignacionDTO {
  oidNecesidad: number;
  oidSeleccionado: number;
  //oidEstadoActividad: number;
  //nombreActividad: string;
}

export interface UpdateAsignacionDTO extends Partial<CreateAsignacionDTO> {
  oidAsignacion: number;
}

export interface DeleteAsignacionDTO {
  oidAsignacion: number;
}

// ========== FILTROS ==========

export interface AsignacionFilters {
  page?: number;
  size?: number;
  sort?: string;
  oidCalendario: number | string; // Obligatorio
  oidDepartamento?: number | string;
  nombreMateria?: string;
  semestreMateria?: number | string;
  codigoMateria?: string;
}

// ========== RESPONSE PARA DELETE ==========

export interface DeleteAsignacionData {
  oid: number;
  mensaje: string;
}

// ========== RESPONSE TYPES ==========

export type AsignacionesListResponse = BaseResponse<
  PaginatedResponse<AsignacionResponse>
>;
export type GetAsignacionResponse = BaseResponse<AsignacionResponse>;
export type CreateAsignacionResponse = BaseResponse<AsignacionResponse>;
export type UpdateAsignacionResponse = BaseResponse<AsignacionResponse>;
export type DeleteAsignacionResponse = BaseResponse<DeleteAsignacionData>;
