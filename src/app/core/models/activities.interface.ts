
/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de actividades
*/

export interface ActivityResponse {
    content:          Activity[];
    pageable:         Pageable;
    totalPages:       number;
    totalElements:    number;
    last:             boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Activity {
    oidActividad:       number;
    codVRI:             string;
    actoAdministrativo: string;
    codigoActividad:    string;
    nombre:             string;
    horas:              number;
    informeEjecutivo:   boolean;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
    tipoActividad:      TipoActividad;
    fuentes:            Fuente[];
    evaluador:          Evaluador;

}

export interface Evaluador {
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
    oidFuente:               number;
    tipoFuente:              string;
    calificacion:            number;
    nombreDocumentoFuente?:  string;
    observacion?:            string;
    fechaCreacion:           Date;
    fechaActualizacion:      Date;
    estadoFuente:            EstadoFuente;
    nombreDocumentoInforme?: string;
    soporte:                 File | null;
    informeEjecutivo:        File | null,
}

export enum EstadoFuente {
    Diligenciado = "Diligenciado",
    Pendiente = "Pendiente",
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
    unpaged:    boolean;
    paged:      boolean;
}

export interface Sort {
    empty:    boolean;
    unsorted: boolean;
    sorted:   boolean;
}


/*
* Interface que nos apoyo con organizar las actividades por tipo de actividad
*/
export interface ActividadesPorTipoActividad {
    nombreType: string;
    activities: Activity[];
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
