/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de responsabilidades
*/

/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de responsabilidades
*/

export interface ResponsabilityResponse {
    content:          Responsability[];
    pageable:         Pageable;
    last:             boolean;
    totalPages:       number;
    totalElements:    number;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Responsability {
    oidActividad:       number;
    nombreActividad:    string;
    horas:              number;
    semanas:            number;
    estadoActividad:    EstadoActividad;
    informeEjecutivo:   boolean;
    fechaCreacion:      string;
    fechaActualizacion: string;
    tipoActividad:      TipoActividad;
    fuentes:            any[];
    evaluado:           Evaluado;
    fuente:             Fuente[];
}

export interface EstadoActividad {
    oidEstadoActividad: number;
    nombre:             string;
    fechaCreacion:      string;
    fechaActualizacion: string;
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
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre:           string;
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

export interface Fuente {
    oidFuente:               number;
    tipoFuente:              string;
    calificacion:            number;
    nombreDocumentoFuente?:  string;
    observacion?:            string;
    fechaCreacion:           string;
    fechaActualizacion:      string;
    estadoFuente:            String;
    nombreDocumentoInforme?: string;
    soporte:                 File | null;
    informeEjecutivo:        File | null,
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
