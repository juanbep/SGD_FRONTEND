export interface ActividadResponse {
  content: ActividadItem[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ActividadItem {
  actividad: Actividad;
  oidCalendario: number;
  nombreCalendario: string;
  usuarios: Usuario[];
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
  roles: string[] | null;
  programaCoordinador: string | null;
  departamentoJefatura: string | null;
}

export interface Atributo {
  codigoAtributo: string;
  valor: string;
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

export interface FiltrosActividad {
  nombreActividad?: string;
  tipoActividad?: number;
  calendario?: number;
  usuario?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

