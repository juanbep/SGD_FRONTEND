
/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de actividades
*/

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
    informeEjecutivo: File | null;
    soporte: File | null;
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

/*
* Interface que nos apoyo con organizar las actividades por tipo de actividad
*/
export interface ActividadesPorTipoActividad {
    nombreType: string;
    activities: Actividad[];
}

/*
* Interface para guardar la evaluacion de una fuente
*/

export interface SourceEvaluation{
    tipoFuente: string;
    calificacion: number;
    oidActividad: number;
    informeEjecutivo: string;
}
