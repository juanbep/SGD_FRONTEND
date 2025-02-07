
/*
* Interface que define la estructura de las actividades y sus fuentes asociadas un docente que se consumo en el servicio de actividades
*/


export interface ActivityResponse {
    content:          Activity[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number;
    first:            boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    empty:            boolean;
}

export interface Activity {
    oidActividad:       number;
    tipoActividad:      TipoActividad;
    oidProceso:         number;
    oidEstadoActividad: number;
    nombreActividad:    string;
    horas:              number;
    semanas:            number;
    informeEjecutivo:   boolean;
    fechaCreacion:      string;
    fechaActualizacion: string;
    fuentes:            Fuente[];
    detalle:            Detalle;
    evaluador:          Evaluador;
    oidEvaluado:        number;
    oidEvaluador:       number;
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

export interface Detalle {
    oidAdministracionDetalle?:        number;
    actoAdministrativo?:              string;
    detalle?:                         string;
    fechaCreacion:                    Date;
    fechaActualizacion:               Date;
    oidCapacitacionDetalle?:          number;
    oidExtensionDetalle?:             number;
    nombreProyecto?:                  string;
    oidOtroServicioDetalle?:          number;
    oidProyectoInvestigacionDetalle?: number;
    vri?:                             string;
    oidTrabajoInvestigacionDetalle?:  number;
    codigo ?:                         string;
    grupo ?:                          string;
    materia ?:                        string;
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


// Interface para guardar una nueva actividad

export interface NewActivity {
    tipoActividad:      TipoNuevaActividad;
    oidEvaluador:       number;
    oidEvaluado:        number;
    oidEstadoActividad: number;
    nombreActividad:    string;
    horas:              number;
    semanas:            number;
    informeEjecutivo:   boolean;
    detalle:            DetalleNuevaActividad;
}

export interface DetalleNuevaActividad {
    oidAdministracionDetalle?:        number;
    actoAdministrativo?:              string;
    detalle?:                         string;
    oidCapacitacionDetalle?:          number;
    oidExtensionDetalle?:             number;
    nombreProyecto?:                  string;
    oidOtroServicioDetalle?:          number;
    oidProyectoInvestigacionDetalle?: number;
    vri?:                             string;
    oidTrabajoInvestigacionDetalle?:  number;
    codigo ?:                         string;
    grupo ?:                          string;
    materia ?:                        string;
    actividad?:                       string;
}

export interface TipoNuevaActividad {
    oidTipoActividad: number;
}
