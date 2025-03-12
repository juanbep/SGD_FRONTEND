import { Fuente } from '../base/fuente.model';

export interface ActividadConsolidadoResponse {
  actividades: Actividades;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Actividades {
  'DOCENCIA': InformacionActividad[];
  'TRABAJO DE INVESTIGACIÓN': InformacionActividad[];
  'PROYECTO DE INVESTIGACIÓN': InformacionActividad[];
  'TRABAJO DE DOCENCIA': InformacionActividad[];
  'ADMINISTRACIÓN': InformacionActividad[];
  'EXTENSIÓN': InformacionActividad[];
  'ASESORIA': InformacionActividad[];
  'CAPACITACIÓN': InformacionActividad[];
  'OTRO SERVICIO': InformacionActividad[];
}

export interface InformacionActividad {
  totalFuentes: number;
  promedio: number;
  oidActividad: number;
  porcentaje: number;
  horas: number;
  acumulado: number;
  fuentes: Fuente[];
  nombre: string;
}
