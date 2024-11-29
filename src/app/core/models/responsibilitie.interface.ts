/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de responsabilidades
*/


export interface Responsabilidad {
    oidActividad:       number;
    codigoActividad:    string;
    nombre:             string;
    horas:              string;
    informeEjecutivo: boolean;
    fechaCreacion:      string;
    fechaActualizacion: string;
    tipoActividad:      TipoActividad;
    fuentes:            Fuente[];
    evaluado:           Evaluado;
}

export interface Evaluado {
    oidUsuario:     number;
    identificacion: string;
    nombres:        string;
    apellidos:      string;
    roles:          Role[];
}

export interface Role {
    nombre: string;
    estado: string;
}

export interface Fuente {
    oidFuente:          number;
    tipoFuente:         string;
    calificacion:       number;
    nombreDocumentoFuente: string;
    nombreDocumentoInforme: string;
    informeEjecutivo:  string;
    observacion:        string;
    fechaCreacion:      string;
    fechaActualizacion: string;
    estadoFuente:       string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre:           string;
    horasTotales:     number;
    descripcion:      string;
}

export interface ResponsabilidadesPorTipoActividad {
    nombreType: string;
    activities: Responsabilidad[];
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
