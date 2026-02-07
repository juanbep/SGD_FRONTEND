import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

export interface UsuarioDetalle {
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

export interface EstadoUsuario {
  oidEstadoUsuario: number;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Rol {
  oid: number;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Modelo principal
export interface Usuario {
  oidUsuario: number;
  usuarioDetalle: UsuarioDetalle;
  estadoUsuario: EstadoUsuario;
  identificacion: string;
  nombres: string;
  apellidos: string;
  username: string;
  correo: string;
  fechaCreacion: string;
  ultimoIngreso: string;
  roles: Rol[];
}

// Filtros para búsqueda y paginación
export interface UsuarioFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  identificacion?: string;
  nombres?: string;
  apellidos?: string;
  username?: string;
  correo?: string;

  // Filtros por detalles
  facultad?: string;
  departamento?: string;
  programa?: string;
  categoria?: string;
  contratacion?: string;
  dedicacion?: string;
  estudios?: string;

  // Filtros por estado
  oidEstadoUsuario?: number;
  estadoNombre?: string;

  // Filtros por rol
  rolNombre?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Tipos de respuesta API
export type UsuariosListResponse = BaseResponse<PaginatedResponse<Usuario>>;
export type GetUsuarioResponse = BaseResponse<Usuario>;

// Type aliases para categorías comunes
export type CategoriaDocente = 'CONTRATADO' | 'PLANTA' | 'OCASIONAL';
export type TipoContratacion = 'CATEDRA' | 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO';
export type TipoDedicacion = 'EXCLUSIVA' | 'COMPLETA' | 'PARCIAL';
export type NivelEstudios =
  | 'PREGRADO'
  | 'ESPECIALIZACION'
  | 'MAESTRÍA'
  | 'DOCTORADO';
