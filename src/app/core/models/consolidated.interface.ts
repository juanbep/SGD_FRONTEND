export interface Teacher {
    nombreDocente:                  string;
    identificacion:                 string;
    contratacion:                   string;
    porcentajeEvaluacionCompletado: number;
    estadoConsolidado:              string;
}

/*
* Interfaz que representa la estructura de un consolidado
* */

export interface Consolidated {
    nombreDocente:        string;
    numeroIdentificacion: string;
    periodoAcademico:     string;
    facultad:             string;
    departamento:         string;
    categoria:            string;
    tipoContratacion:     string;
    dedicacion:           string;
    actividades:          Actividades;
    totalHorasSemanales:  number;
    totalPorcentaje:      number;
    totalAcumulado:       number;
}

export interface Actividades {
    "Docencia":                  InfoActivities[];
    "Trabajos de Investigacion": InfoActivities[];
    "Trabajos Docencia":         InfoActivities[];
    "Trabajos investigación":    InfoActivities[];
    "Administración":         InfoActivities[];
    "Asesoría":         InfoActivities[];
    "Otros servicios":         InfoActivities[];
}

export interface InfoActivities {
    promedio:        number;
    codigoActividad: string;
    oidActividad:    number;
    porcentaje:      number;
    horas:           number;
    acumulado:       number;
    fuentes:         Fuente[];
    nombre:          string;
}

export interface Fuente {
    oidFuente:    number;
    tipoFuente:   string;
    calificacion: number;
    estadoFuente: EstadoFuente;
}

export enum EstadoFuente {
    Diligenciado = "Diligenciado",
    Pendiente = "Pendiente",
}
