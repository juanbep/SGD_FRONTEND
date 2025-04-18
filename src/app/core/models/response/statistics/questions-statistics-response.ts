export interface QuestionStatisticsResponse {
    oidPeriodo:    number;
    nombre:        string;
    departamentos: Departamento[];
}

export interface Departamento {
    departamento:   string;
    tiposActividad: TiposActividad[];
}

export interface TiposActividad {
    oidTipoActividad: number;
    nombre:           string;
    preguntas:        Pregunta[];
}

export interface Pregunta {
    oidPregunta: number;
    texto:       string;
    promedio:    number;
}
