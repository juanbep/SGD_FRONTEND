import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// Interfaces anidadas del Usuario
export interface RolSimple {
  nombre: string;
}

export interface UsuarioDetalleSimple {
  oidUsuarioDetalle: number;
  facultad: string;
  departamento: string;
  programa: string | null;
  categoria: string;
  contratacion: string;
  dedicacion: string;
  estudios: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface UsuarioSimple {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: string | null;
  roles: RolSimple[];
  usuarioDetalle: UsuarioDetalleSimple;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
}

// Modelo principal
export interface UsuarioDepartamento {
  usuario: UsuarioSimple;
  oidDepartamento: number;
  nombreDepartamento: string;
  fechaCreacion: string;
  totalHorasActividades: number;
}

// Filtros para búsqueda y paginación
export interface UsuarioDepartamentoFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;

  // Filtros por usuario
  identificacion?: string;
  nombres?: string;
  apellidos?: string;

  // Filtros por departamento
  oidDepartamento?: number | null;
  nombreDepartamento?: string;

  // Filtros por detalles de usuario
  facultad?: string;
  categoria?: string;
  contratacion?: string;
  dedicacion?: string;
  estudios?: string;

  // Filtros por rol
  rolNombre?: string;

  // Filtros por horas
  minHorasActividades?: number;
  maxHorasActividades?: number;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Tipos de respuesta API
export type UsuariosDepartamentoListResponse = BaseResponse<
  PaginatedResponse<UsuarioDepartamento>
>;
export type GetUsuarioDepartamentoResponse = BaseResponse<UsuarioDepartamento>;
