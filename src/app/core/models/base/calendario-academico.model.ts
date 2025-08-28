export interface EventoCalendario {
  id: number;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin?: Date;
  categoria: CategoriaEvento;
  destacado?: boolean;
}

export interface CalendarioAcademico {
  acuerdoAcademico: string;
  id: number;
  anio: number;
  periodo: string;
  estado: 'ACTIVO' | 'DESHABILITADO' | 'APROBADO' | 'PENDIENTE';
  eventos: EventoCalendario[];
}

export type CategoriaEvento =
  | 'RESALTADA'
  | 'NO_RESALTADA'
  | 'ADMINISTRATIVA'
  | 'CATEDRA'
  | 'PLANTA'
  | 'OCASIONAL'
  | 'PRACTICANTE';
