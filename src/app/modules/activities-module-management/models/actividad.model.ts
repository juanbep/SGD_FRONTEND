import { BaseResponse, PaginatedResponse } from '../shared/shared.model';

export interface TipoActividad {
  oidTipoActividad: number;
  nombre: string;
  descripcion: string;
}

export interface Atributo {
  codigoAtributo: string;
  valor: string;
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

export interface ActividadResponse {
  actividad: Actividad;
  oidCalendario: number;
  nombreCalendario: string;
  usuarios: Usuario[];
}

export type ActividadesListResponse = BaseResponse<
  PaginatedResponse<ActividadResponse>
>;
