export interface FuenteEstudianteFormulario {
    oidFuente:                number;
    tipoCalificacion:         string;
    observacion:              string;
    oidEstadoEtapaDesarrollo: number;
    encuesta:                 Encuesta;
    preguntas:                Pregunta[];
}

interface Encuesta {
    nombre: string;
}

interface Pregunta {
    oidPregunta: number;
    respuesta:   number;
}
