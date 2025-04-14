export interface QuestionStatisticsResponse {
    periodo:               Periodo;
    tipoActividad:         TipoActividad;
    evaluacionPorPregunta: EvaluacionPorPregunta[];
}

export interface EvaluacionPorPregunta {
    pregunta:             string;
    promedioCalificacion: number;
}

export interface Periodo {
    oidPeriodo: number;
    nombre:     string;
}

export interface TipoActividad {
    oidTipoActividad: number;
    nombre:           string;
}
