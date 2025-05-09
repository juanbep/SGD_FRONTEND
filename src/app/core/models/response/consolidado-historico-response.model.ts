export interface ConsolidadoHistoricoResponse {
    oidUsuario:               number;
    nombreDocente:            string;
    numeroIdentificacion:     string;
    facultad:                 string;
    departamento:             string;
    categoria:                string;
    tipoContratacion:         string;
    dedicacion:               string;
    calificacionesPorPeriodo: CalificacionesPorPeriodo[];
}

export interface CalificacionesPorPeriodo {
    idPeriodoAcademico: number;
    calificacion:       number;
}
