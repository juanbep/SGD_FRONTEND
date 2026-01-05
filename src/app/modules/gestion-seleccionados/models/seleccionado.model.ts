import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// ========== ENTIDADES BASE ==========

export interface Rol {
  nombre: string;
}

export interface UsuarioDetalle {
  oidUsuarioDetalle: number;
  facultad: string | null;
  departamento: string | null;
  programa: string | null;
  categoria: string | null;
  contratacion: string | null;
  dedicacion: string | null;
  estudios: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Usuario {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: string | null;
  roles: Rol[];
  usuarioDetalle: UsuarioDetalle | null;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
  horasLaborDocente: number | null;
}

// ========== SELECCIONADO ==========

export interface SeleccionadoResponse {
  oidSeleccionado: number;
  oidCalendario: number;
  usuario: Usuario;
  tipo: string | null;
  dedicacion: string | null;
  fechaCreacion: string | null;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

// ========== DTOs PARA CREAR/ACTUALIZAR ==========

export interface CreateSeleccionadoDTO {
  oidCalendario: number;
  oidUsuario: number;
  tipo?: string | null;
  dedicacion?: string | null;
}

export interface UpdateSeleccionadoDTO {
  oidSeleccionado: number;
  oidCalendario?: number;
  oidUsuario?: number;
  tipo?: string | null;
  dedicacion?: string | null;
}

export interface DeleteSeleccionadoDTO {
  oidSeleccionado: number;
}

// ========== FILTROS ==========

export interface SeleccionadoFilters {
  page?: number;
  size?: number;
  sort?: string;
  oidCalendario: number | string; // Obligatorio
  oidDepartamento: number | string; // Obligatorio
  identificacion?: string;
  nombreCompleto?: string;
  correo?: string;
  contratacion?: string;
  dedicacion?: string;
}

// ========== RESPONSE PARA DELETE ==========

export interface DeleteSeleccionadoData {
  oid: number;
  mensaje: string;
}

// ========== RESPONSE TYPES ==========

export type SeleccionadosListResponse = BaseResponse<
  PaginatedResponse<SeleccionadoResponse>
>;
export type GetSeleccionadoResponse = BaseResponse<SeleccionadoResponse>;
export type CreateSeleccionadoResponse = BaseResponse<SeleccionadoResponse>;
export type UpdateSeleccionadoResponse = BaseResponse<SeleccionadoResponse>;
export type DeleteSeleccionadoResponse = BaseResponse<DeleteSeleccionadoData>;
