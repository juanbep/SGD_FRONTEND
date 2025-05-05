

export interface CatalogDataResponse {
    facultades:      Type[];
    departamentos:   Type[];
    programas:       Type[];
    categorias:      Type[];
    contrataciones:  Type[];
    dedicaciones:    Type[];
    estudios:        Type[];
    roles:           Type[];
    tipoActividades: Type[];
    preguntaEvaluacionDocente: TypePreguntaEvaluacionDocente[];
    estadoEtapaDesarrollo: TypeEstadoEtapaDesarrollo[];
}

interface Type {
    nombre: string;
    codigo: string;
}

interface TypePreguntaEvaluacionDocente {
    oidPregunta: number;
    pregunta: string;
}

interface TypeEstadoEtapaDesarrollo {
    oidEstadoEtapaDesarrollo: number;
    nombre: string;
}
