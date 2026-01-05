// ========================================
// INTERFACES PRINCIPALES
// ========================================

export interface Seleccionado {
  oidSeleccionado: number;
  oidCalendario: number;
  usuario: UsuarioSeleccionado;
  tipo: string | null;
  dedicacion: string;
  fechaCreacion: string | null;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

export interface UsuarioSeleccionado {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: string | null;
  roles: RolUsuario[];
  usuarioDetalle: UsuarioDetalle;
  programaCoordinador: any;
  departamentoJefatura: any;
  horasLaborDocente: any;
}

export interface RolUsuario {
  nombre: string;
}

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

// ========================================
// DTOs - REQUEST
// ========================================

export interface CrearSeleccionadoRequest {
  oidCalendario: number;
  oidUsuario: number;
  tipo?: string;
  dedicacion?: string;
}

export interface ActualizarSeleccionadoRequest {
  oidCalendario?: number;
  oidUsuario?: number;
  tipo?: string;
  dedicacion?: string;
}

// ========================================
// DTOs - FILTROS
// ========================================

export interface SeleccionadoFiltros {
  page: number;
  size: number;
  oidCalendario: number;
  oidDepartamento: number;
  identificacion?: string;
  nombreCompleto?: string;
  correo?: string;
  contratacion?: TipoContratacion;
  dedicacion?: TipoDedicacion;
}

// ========================================
// ENUMS Y TIPOS
// ========================================

export type TipoContratacion =
  | 'PLANTA'
  | 'OCASIONAL'
  | 'CATEDRA'
  | 'BECARIO'
  | 'PRACTICANTE';

export type TipoDedicacion =
  | 'MEDIO TIEMPO'
  | 'TIEMPO COMPLETO'
  | 'HORAS CATEDRA';

// ========================================
// CONSTANTES
// ========================================

export const TIPOS_CONTRATACION: TipoContratacion[] = [
  'PLANTA',
  'OCASIONAL',
  'CATEDRA',
  'BECARIO',
  'PRACTICANTE',
];

export const TIPOS_DEDICACION: TipoDedicacion[] = [
  'MEDIO TIEMPO',
  'TIEMPO COMPLETO',
  'HORAS CATEDRA',
];

// ========================================
// RESPONSE WRAPPER (Reutilizable de tu SGD)
// ========================================

export interface ApiResponse<T> {
  codigo: number;
  mensaje: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// ========================================
// DELETE RESPONSE
// ========================================

export interface DeleteSeleccionadoResponse {
  mensaje: string;
  oid: number;
}
