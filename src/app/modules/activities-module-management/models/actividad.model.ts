import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

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

export interface CreateAtributoDTO {
  nombre: string;
  tipo: string;
  valor: string;
}

export interface CreateActividadDTO {
  oidTipoActividad: number;
  oidCargoActividad: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  horas: number;
  semanas: number;
  oidCalendario: number;
  oidsUsuarios: number[];
  atributos: CreateAtributoDTO[];
}

export interface UpdateActividadDTO
  extends Partial<Omit<CreateActividadDTO, 'oidsUsuarios'>> {
  oidActividad: number;
  oidsUsuarios?: number[];
}

export interface DeleteActividadDTO {
  oidActividad: number;
}

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
export type DeleteActividadResponse = BaseResponse<boolean>;
