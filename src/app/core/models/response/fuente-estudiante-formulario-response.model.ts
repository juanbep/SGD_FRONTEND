export interface FuenteEstudianteFormularioResponse {
    oidFuente:             number;
    evaluado:              Evaluado;
    evaluador:             Evaluado;
    observacion:           String;
    nombreArchivo:         string;
    tipoCalificacion:      string;
    encuesta:              Encuesta;
    estadoEtapaDesarrollo: EstadoEtapaDesarrollo;
    fechaCreacion:         String;
    fechaActualizacion:    String;
    preguntas:             Pregunta[];
}

interface Encuesta {
    nombre: string;
}

interface EstadoEtapaDesarrollo {
    oidEstadoEtapaDesarrollo: number;
    nombre:                   string;
}

interface Evaluado {
    oidUsuario:     number;
    nombreCompleto: string;
}

interface Pregunta {
    oidPregunta: number;
    respuesta:   number;
}
