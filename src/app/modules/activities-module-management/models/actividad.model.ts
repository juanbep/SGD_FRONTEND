import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

// ========== ENTIDADES BASE ==========

export interface TipoActividad {
  oidTipoActividad: number;
  nombre: string;
  descripcion: string;
}

export interface Usuario {
  oidUsuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  departamento: string | null;
  roles: string | null;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
}

export interface Actividad {
  oidActividad: number;
  tipoActividad: TipoActividad;
  oidEstadoActividad: number;
  nombreActividad: string;
  horas: number;
  semanas: number;
  informeEjecutivo: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  atributos: Atributo[];
  idLaborDocente: number | null;
  esLaborDocente: boolean | null;
  archivoLaborDocente: string | null;
}

export interface Atributo {
  codigoAtributo: string;
  valor: string;
}

// ========== DTOs PARA CREAR/ACTUALIZAR ==========
// Resultado individual del procesamiento batch
export interface BatchActividadResult {
  indice: number;
  exito: boolean;
  mensaje: string;
  actividad: ActividadResponse | null; // null si hubo error
}

// Atributo simple (como ya lo tenías)
export interface AtributoActividad {
  nombre: string;
  tipo: string;
  valor: string;
}

// Usuario con cargo y horas
export interface UsuarioActividad {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

// Atributos repetibles (grupos)
export interface AtributoRepetible {
  grupo: string; // 'ESTUDIANTES', 'DOCUMENTOS', etc.
  items: AtributoActividad[][]; // Array de arrays
}

// DTO para crear actividad (ACTUALIZADO)
export interface CreateActividadDTO {
  oidTipoActividad: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  semanas: number;
  oidCalendario: number;
  usuarios: UsuarioActividad[]; // CAMBIADO: de oidsUsuarios a usuarios con detalle
  atributos: AtributoActividad[]; // Atributos simples
  atributosRepetibles?: AtributoRepetible[]; // Atributos repetibles
}

// DTO para actualizar actividad
export interface UpdateActividadDTO
  extends Partial<Omit<CreateActividadDTO, 'usuarios'>> {
  oidActividad: number;
  usuarios?: UsuarioActividad[];
}

// DTO para eliminar
export interface DeleteActividadDTO {
  oidActividad: number;
}

// ========== MODELO DE MEMORIA (FRONTEND) ==========

export interface ActividadEnMemoria {
  id?: string; // ID temporal para manejar en memoria
  oidActividad?: number; // ID real del backend (cuando se edita)
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

// ========== FILTROS ==========

export interface ActividadFilters {
  // Paginación
  page?: number;
  size?: number;

  // Búsqueda general
  searchTerm?: string;
  nombreActividad?: string;

  // Filtros por ID/estado
  oidEstadoActividad?: string | number;
  oidTipoActividad?: string | number;
  oidCalendario?: string | number;
  oidDepartamento?: string | number;
  oidUsuarioResponsable?: number | string;

  // Filtros por rangos numéricos
  horasMin?: number;
  horasMax?: number;
  semanasMin?: number;
  semanasMax?: number;

  // Filtros por fechas
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;

  // Filtros por atributos específicos
  semestre?: string;
  nombreEstudiante?: string;

  // Ordenamiento
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ========== RESPONSE TYPES ==========

export interface ActividadResponse {
  actividad: Actividad;
  oidCalendario: number;
  nombreCalendario: string;
  usuarios: Usuario[];
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
