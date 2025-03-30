export interface FuenteEstudianteFormularioResponse {
    Fuente:                Fuente;
    encuesta:              Encuesta;
    estadoEtapaDesarrollo: EstadoEtapaDesarrollo;
    preguntas:             Pregunta[];
}

export interface Fuente {
    oidFuente:          number;
    evaluado:           Evaluado;
    evaluador:          Evaluado;
    observacion:        string;
    nombreArchivo:      string;
    tipoCalificacion:   string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

export interface Evaluado {
    apellidos:      string;
    nombreCompleto: string;
    nombres:        string;
}

export interface Encuesta {
    nombre: string;
}

export interface EstadoEtapaDesarrollo {
    oidEstadoEtapaDesarrollo: number;
    nombre:                   string;
}

export interface Pregunta {
    oidPregunta: number;
    respuesta:   number;
}



