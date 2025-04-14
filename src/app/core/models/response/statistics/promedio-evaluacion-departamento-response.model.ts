export interface PromedioEvaluacionDepartamentoResponse {
    promediosPorDepartamento: PromediosPorDepartamento[];
}

export interface PromediosPorDepartamento {
    departamento:    string;
    promedioGeneral: number;
}
