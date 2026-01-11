import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// ========== ENTIDADES BASE ==========

export interface TipoActividad {
  oidTipoActividad: number;
  nombre: string;
  descripcion: string;
}

export interface Atributo {
  codigoAtributo: string;
  valor: string;
}

// ========== ESTRUCTURAS ANIDADAS PARA USUARIO EN ACTIVIDAD ==========

export interface Departamento {
  oidDepartamento: number;
  nombre: string;
  facultad: string;
  jefeOidUsuario: number | null;
  jefeNombre: string | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
  usuarioCreacion: string | null;
  usuarioActualizacion: string | null;
}

export interface Rol {
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

export interface HorasLaborDocente {
  horasAsignadasPorTipoActividad: Record<string, number>;
  totalHorasAsignadas: number;
  horasDisponiblesPorTipoActividad: Record<string, number>;
  totalHorasDisponibles: number;
}

// ========== USUARIO EN CONTEXTO DE ACTIVIDAD ==========

export interface UsuarioEnActividad {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: Departamento | null;
  roles: Rol[];
  usuarioDetalle: UsuarioDetalle;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
  horasLaborDocente: HorasLaborDocente | null;
}

// ========== ACTIVIDAD ==========

export interface Actividad {
  oidActividad: number;
  tipoActividad: TipoActividad;
  oidEstadoActividad: number;
  nombreActividad: string;
  semanas: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  atributos: Atributo[];
}

// ========== ASIGNACIÓN DE USUARIO A ACTIVIDAD ==========

export interface UsuarioActividadAsignacion {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

// ========== DTOs PARA CREAR/ACTUALIZAR ==========

export interface BatchActividadResult {
  indice: number;
  exito: boolean;
  mensaje: string;
  actividad: ActividadResponse | null;
}

export interface AtributoActividad {
  nombre: string;
  tipo: string;
  valor: string;
}

export interface UsuarioActividad {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

export interface AtributoRepetible {
  grupo: string;
  items: AtributoActividad[][];
}

export interface CreateActividadDTO {
  oidTipoActividad: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  semanas: number;
  oidCalendario: number;
  usuarios: UsuarioActividad[];
  atributos: AtributoActividad[];
  atributosRepetibles?: AtributoRepetible[];
}

export interface UpdateActividadDTO
  extends Partial<Omit<CreateActividadDTO, 'usuarios'>> {
  oidActividad: number;
  usuarios?: UsuarioActividad[];
}

export interface DeleteActividadDTO {
  oidActividad: number;
}

// ========== MODELO DE MEMORIA (FRONTEND) ==========

export interface ActividadEnMemoria {
  id?: string;
  oidActividad?: number;
  oidTipoActividad: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  semanas: number;
  oidCalendario: number;
  usuarios: UsuarioActividad[];
  atributos: AtributoActividad[];
  atributosRepetibles?: AtributoRepetible[];
}

// ========== RESPUESTAS DEL BACKEND ==========

export interface DesasignarUsuarioResponse {
  mensaje: string;
  oidCalendario: number;
  oidUsuario: number;
  oidActividad: number;
}

export interface ActividadResponse {
  actividad: Actividad;
  oidCalendario: number;
  nombreCalendario: string;
  usuarios: UsuarioEnActividad[];
  usuariosActividad: UsuarioActividadAsignacion[];
}

// ========== FILTROS ==========

export interface ActividadFilters {
  page?: number;
  size?: number;
  searchTerm?: string;
  nombreActividad?: string;
  oidEstadoActividad?: string | number;
  oidTipoActividad?: string | number;
  oidCalendario?: string | number;
  oidDepartamento?: number;
  oidUsuarioResponsable?: number | string;
  horasMin?: number;
  horasMax?: number;
  semanasMin?: number;
  semanasMax?: number;
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;
  semestre?: string;
  nombreEstudiante?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ActividadDocenciaFilters {
  page?: number;
  size?: number;
  sort?: string;
  oidCalendario?: number | string;
  oidDepartamento?: number | string;
  oidUsuario?: number | string;
  tipoContratacion?: string;
  semestre?: number | string;
}

// ========== RESPONSE TYPES ==========

export type ActividadesListResponse = BaseResponse<
  PaginatedResponse<ActividadResponse>
>;
export type GetActividadResponse = BaseResponse<ActividadResponse>;
export type CreateActividadResponse = BaseResponse<ActividadResponse>;
export type UpdateActividadResponse = BaseResponse<ActividadResponse>;
export type CreateActividadesBatchResponse = BaseResponse<
  BatchActividadResult[]
>;
export type DesasignarUsuarioActividadResponse =
  BaseResponse<DesasignarUsuarioResponse>;
export type DeleteActividadResponse = BaseResponse<boolean>;
