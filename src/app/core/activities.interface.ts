export interface Actividad {
    oidActividad: number;
    codigoActividad: string;
    nombre: string;
    horas: string;
    informeEjecutivo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
    tipoActividad: TipoActividad;
    fuentes: Fuente[];
    evaluador: Evaluador;
}

export interface Evaluador {
    oidUsuario: number;
    identificacion: string;
    nombres: string,
    apellidos: string,
    roles: Role[];
}

export interface Role {
    nombre: string;
    estado: string;
}

export interface Fuente {
    oidFuente: number;
    tipoFuente: string;
    calificacion: number;
    nombreDocumentoFuente: string;
    nombreDocumentoInforme: string;
    informeEjecutivo: string;
    observacion: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    estadoFuente: string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre: string;
    horasTotales: number;
    descripcion: string;
}

export interface ActividadesPorTipoActividad {
    nombreType: string;
    activities: Actividad[];
}


export interface SourceEvaluation{
    tipoFuente: string;
    calificacion: number;
    oidActividad: number;
    informeEjecutivo: string;
}

export interface SourceResposability{
    tipoFuente: string;
    calificacion: number;
    oidActividad: number;
}