export interface FuenteAutoevaluacion {
  oidFuente: number;
  tipoCalificacion: 'EN_LINEA' | 'PRESENCIAL' | string;
  calificacion: number;
  observacion: string;
  descripcion: string;
  odsSeleccionados: OdsSeleccionado[];
  leccionesAprendidas: LeccionAprendida[];
  oportunidadesMejora: OportunidadMejora[];
}

export interface OdsSeleccionado {
  oidAutoevaluacionOds: number | null;
  oidOds: number;
  resultado: string;
  documento: string;
}

export interface LeccionAprendida {
  oidLeccionAprendida: number | null;
  descripcion: string;
}

export interface OportunidadMejora {
  oidOportunidadMejora: number | null;
  descripcion: string;
}
