export interface EvolucionPromedioEvaluacionDepartamento {
    departamento: string;
    evolucion:    Evolucion[];
}

export interface Evolucion {
    periodo:             string;
    promedioConsolidado: number;
}
