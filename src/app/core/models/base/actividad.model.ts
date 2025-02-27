export interface Actividad {
    oidActividad: number;
    oidTipoActividad: number;
    oidProceso: number;
    oidEstadoActividad: number;
    nombreActividad: string;
    horas: number;
    semanas: number;
    informeEjecutivo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
  }