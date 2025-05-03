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
  'TRABAJOS DE INVESTIGACION': InformacionActividad[];
  'PROYECTOS INVESTIGACIÓN': InformacionActividad[];
  'TRABAJO DE DOCENCIA': InformacionActividad[];
  'ADMINISTRACIÓN': InformacionActividad[];
  'EXTENSIÓN': InformacionActividad[];
  'ASESORÍA': InformacionActividad[];
  'CAPACITACIÓN': InformacionActividad[];
  'OTROS SERVICIOS': InformacionActividad[];
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
