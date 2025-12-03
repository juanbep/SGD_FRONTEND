import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

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

export interface TipoActividad {
  oidTipoActividad: number;
  nombre: string;
  descripcion: string;
}

export interface Atributo {
  codigoAtributo: string;
  valor: string;
}

export interface Usuario {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: Departamento;
  roles: Rol[];
  usuarioDetalle: UsuarioDetalle;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
  horasLaborDocente: HorasLaborDocente;
}

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

export interface AtributoRepetible {
  grupo: string;
  items: AtributoActividad[][];
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

export interface BatchActividadResult {
  indice: number;
  exito: boolean;
  mensaje: string;
  actividad: ActividadResponse | null;
}

export interface ActividadResponse {
  actividad: Actividad;
  oidCalendario: number;
  nombreCalendario: string;
  usuarios: Usuario[];
  usuariosActividad: UsuarioActividadAsignacion[];
}

export interface UsuarioActividadAsignacion {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

export interface DesasignarUsuarioResponse {
  mensaje: string;
  oidCalendario: number;
  oidUsuario: number;
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

export interface ActividadFilters {
  page?: number;
  size?: number;
  searchTerm?: string;
  nombreActividad?: string;
  oidEstadoActividad?: string | number;
  oidTipoActividad?: string | number;
  oidCalendario?: string | number;
  oidDepartamento?: string | number;
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
