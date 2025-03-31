export interface FuenteEstudianteFormularioResponse {
    Fuente:                Fuente;
    encuesta:              Encuesta;
    estadoEtapaDesarrollo: EstadoEtapaDesarrollo;
    preguntas:             Pregunta[];
}

interface Fuente {
    oidFuente:          number;
    evaluado:           Evaluado;
    evaluador:          Evaluado;
    observacion:        null;
    nombreArchivo:      string;
    calificacion:       number;
    tipoCalificacion:   string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

interface Evaluado {
    apellidos:      string;
    oidUsuario:     number;
    departamento:   string;
    nombreCompleto: string;
    nombres:        string;
}

interface Encuesta {
    nombre: string;
}

interface EstadoEtapaDesarrollo {
    oidEstadoEtapaDesarrollo: number;
    nombre:                   string;
}

interface Pregunta {
    oidPregunta: number;
    respuesta:   number;
}



