export interface ConsolidatedTeachersResponse {
    content: Teacher[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface Teacher {
    oidUsuario: number;
    nombreDocente: string;
    identificacion: string;
    contratacion: string;
    porcentajeEvaluacionCompletado: number;
    estadoConsolidado: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}


// Interfaz que representa la estructura de la información de un docente

export interface TeacherInformationResponse {
    nombreDocente:        string;
    numeroIdentificacion: string;
    periodoAcademico:     string;
    facultad:             string;
    departamento:         string;
    categoria:            string;
    tipoContratacion:     string;
    dedicacion:           string;
    horasTotales:         number;
    totalPorcentaje:      number;
    totalAcumulado:       number;
    currentPage:          number;
    pageSize:             number;
    totalItems:           number;
    totalPages:           number;
}


/*
* Interfaz que representa la estructura de un consolidado
* */


export interface ConsolidatedActivitiesResponse {
    actividades: Actividades;
    currentPage: number;
    pageSize:    number;
    totalItems:  number;
    totalPages:  number;
}

export interface InfoActivitie {
    totalFuentes: number;
    promedio:     number;
    oidActividad: number;
    porcentaje:   number;
    horas:        number;
    acumulado:    number;
    fuentes:      Fuente[];
    nombre:       string;
}

export interface Fuente {
    oidFuente:              number;
    tipoFuente:             string;
    calificacion:           null;
    nombreDocumentoFuente:  null;
    nombreDocumentoInforme: null;
    observacion:            null;
    fechaCreacion:          null;
    fechaActualizacion:     null;
    estadoFuente:           string;
}


export interface Actividades {
    "DOCENCIA": InfoActivitie[];
    "TRABAJO DE INVESTIGACIÓN": InfoActivitie[];
    "PROYECTO DE INVESTIGACIÓN": InfoActivitie[];
    "TRABAJO DE DOCENCIA": InfoActivitie[];
    "ADMINISTRACIÓN": InfoActivitie[];
    "EXTENSIÓN": InfoActivitie[];
    "ASESORÍA": InfoActivitie[];
    "CAPACITACIÓN": InfoActivitie[];
    "OTROS SERVICIOS": InfoActivitie[];
}




//Información actividad

export interface Actividad {
    oidActividad: number;
    codigoActividad: string;
    nombre: string;
    horas: number;
    informeEjecutivo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    tipoActividad: TipoActividad;
    fuentes: FuenteActividad[];
    evaluador: Evaluador;
}

export interface Evaluador {
    oidUsuario: number;
    identificacion: string;
    nombres: string;
    apellidos: string;
    roles: Role[];
}

export interface Role {
    nombre: string;
    estado: string;
}

export interface FuenteActividad {
    oidFuente: number;
    tipoFuente: string;
    calificacion: number;
    fechaCreacion: string;
    fechaActualizacion: string;
    estadoFuente: string;
    nombreDocumentoFuente: string;
    nombreDocumentoInforme: string;
    observacion: string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre: string;
    horasTotales: number;
    descripcion: string;
}
