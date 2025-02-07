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


/*
* Interfaz que representa la estructura de un consolidado
* */

export interface Consolidated {
    nombreDocente: string;
    numeroIdentificacion: string;
    periodoAcademico: string;
    facultad: string;
    departamento: string;
    categoria: string;
    tipoContratacion: string;
    dedicacion: string;
    actividades: Actividades;
    totalHorasSemanales: number;
    totalPorcentaje: number;
    totalAcumulado: number;
}

export interface Actividades {
    "DOCENCIA": InfoActivities[];
    "TRABAJOS DE INVESTIGACIÓN": InfoActivities[];
    "PROYECTO DE INVESTIGACIÓN": InfoActivities[];
    "TRABAJOS DOCENCIA": InfoActivities[];
    "ADMINISTRACIÓN": InfoActivities[];
    "EXTENSIÓN": InfoActivities[];
    "ASESORÍA": InfoActivities[];
    "CAPACITACIÓN": InfoActivities[];
    "OTROS SERVICIOS": InfoActivities[];
}

export interface InfoActivities {
    promedio: number;
    codigoActividad: string;
    oidActividad: number;
    porcentaje: number;
    horas: number;
    acumulado: number;
    fuentes: Fuente[];
    nombre: string;
}

export interface Fuente {
    oidFuente: number;
    tipoFuente: string;
    calificacion: number;
    estadoFuente: EstadoFuente;
}

export enum EstadoFuente {
    Diligenciado = "Diligenciado",
    Pendiente = "Pendiente",
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
