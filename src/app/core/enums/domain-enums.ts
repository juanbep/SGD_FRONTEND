// Facultades enum
export enum FACULTADES {
    INGENIERIA_ELECTRONICA_Y_TELECOMUNICACIONES = "INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES"
}

// Departamentos enum
export enum DEPARTAMENTOS {
    ELECTRONICA_INSTRUMENTACION_Y_CONTROL = "DEPARTAMENTO DE ELECTRÓNICA, INSTRUMENTACIÓN Y CONTROL",
    TELEMATICA = "DEPARTAMENTO DE TELEMATICA",
    TELECOMUNICACIONES = "DEPARTAMENTO DE TELECOMUNICACIONES",
    SISTEMAS = "DEPARTAMENTO DE SISTEMAS"
}

// Categorias enum
export enum CATEGORIAS {
    ASOCIADO = "ASOCIADO",
    TITULAR = "TITULAR"
}

// Contrataciones enum
export enum CONTRATACIONES {
    PLANTA = "PLANTA",
    OCASIONAL = "OCASIONAL",
    BECARIOS_Y_PRACTICANTES = "BECARIOS Y PRACTICANTES",
    CATEDIA = "CÁTEDRA"  // Note: renamed key as CATEDIA to avoid accents in key name.
}

// Dedicaciones enum
export enum DEDICACIONES {
    TIEMPO_COMPLETO = "TIEMPO COMPLETO",
    MEDIO_TIEMPO = "MEDIO TIEMPO"
}

// Estudios enum
export enum ESTUDIOS {
    MAESTRIA = "MAESTRÍA",
    DOCTORADO = "DOCTORADO",
    POSDOCTORADO = "POSDOCTORADO",
    ESPECIALIZACION = "ESPECIALIZACIÓN"
}

// Roles enum
export enum ROLES {
    DOCENTE = 1,
    ESTUDIANTE = 2,
    DECANO = 3,
    JEFE_DE_DEPARTAMENTO = 4,
    SECRETARIA_O_FACULTAD = 5,
    COORDINADOR = 6,
    CPD = 7
}

// TipoActividades enum
export enum TIPO_ACTIVIDADES {
    TRABAJO_DE_DOCENCIA = 1,
    PROYECTO_DE_INVESTIGACION = 2,
    CAPACITACION = 3,
    ADMINISTRACION = 4,
    OTRO_SERVICIO = 5,
    EXTENSION = 6,
    TRABAJO_DE_INVESTIGACION = 7,
    ASESORIA = 8,
    DOCENCIA = 9,
    SERVICIO = 10,
    SEMILLERO_INVESTIGACION = 11,

}

// PreguntaEvaluacionDocente enum
export enum PREGUNTA_EVALUACION_DOCENTE {
    PREGUNTA_1 = "El profesor ha definido unos horarios regulares de reunión para control y seguimiento del trabajo",
    PREGUNTA_2 = "El profesor asiste puntualmente a las reuniones programadas",
    PREGUNTA_3 = "El profesor dedica tiempo suficiente y necesario para discutir asuntos relacionados con el desarrollo del trabajo de grado",
    PREGUNTA_4 = "El profesor es oportuno en la revisión de los documentos y productos generados",
    PREGUNTA_5 = "El profesor tiene dominio general sobre la temática relacionada con el proyecto",
    PREGUNTA_6 = "El profesor sugiere, asesora y realiza aportes para mejorar la calidad del trabajo de grado y/o sus productos",
    PREGUNTA_7 = "El profesor mantiene una relación cordial de respeto con el estudiante",
    PREGUNTA_8 = "El profesor motiva la investigación, el desarrollo y la innovación en el trabajo de grado"
}

// EstadoEtapaDesarrollo enum
export enum ESTADO_ETAPA_DESARROLLO {
    REVISION = 1,
    FINALIZADO = 2,
    EN_PROGRESO = 3
}

//Objetivo de Desarrollo Sostenible



