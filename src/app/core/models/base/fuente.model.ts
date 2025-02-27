export interface Fuente {
  oidFuente: number;
  tipoFuente: string;
  calificacion?: number | null;
  nombreDocumentoFuente?: string | null;
  nombreDocumentoInforme?: string | null;
  observacion?: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  estadoFuente: string;
  soporte?: File | null;
  informeEjecutivo?: File | null;
}
