export interface AutoevaluacionFuente {
    descripcionActividad: string;
    resultados: Resultado[];
    leccionesAprendidas: LeccionAprendida[];
    oportunidadesMejora: OportunidadMejora[];
    evaluacion: number,
    observaciones?: string,
}

interface Resultado {
    resultado: string;
    ODS: string;
    evidencia: File,
}

interface LeccionAprendida {
    leccion: string;
}

interface OportunidadMejora {
    oportunidad: string;
}