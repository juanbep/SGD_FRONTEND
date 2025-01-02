/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de responsabilidades
*/

export interface ResponsabilityResponse {
    content:          Responsability[];
    pageable:         Pageable;
    totalElements:    number;
    last:             boolean;
    totalPages:       number;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Responsability {
    oidActividad:       number;
    codigoActividad:    string;
    nombre:             string;
    horas:              number;
    informeEjecutivo:   boolean;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
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
    oidFuente:              number;
    tipoFuente:             string;
    calificacion:           number;
    nombreDocumentoFuente:  string;
    nombreDocumentoInforme: string;
    observacion?:           string;
    fechaCreacion:          Date;
    fechaActualizacion:     Date;
    estadoFuente:           string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre:           string;
    horasTotales:     number;
    descripcion:      string;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}

export interface ResponsabilidadesPorTipoActividad {
    nombreType: string;
    activities: Responsability[];
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
