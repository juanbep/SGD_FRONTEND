export interface FuenteDocenteFormularioResponse {
    Fuente:              Fuente;
    actividad:           Actividad;
    firma:               string;
    Descripcion:         string;
    screenshotSimca:     null;
    odsSeleccionados:    OdsSeleccionado[];
    leccionesAprendidas: LeccionesAprendida[];
    oportunidadesMejora: OportunidadesMejora[];
}

export interface Fuente {
    oidFuente:          number;
    evaluado:           Evaluado;
    evaluador:          Evaluado;
    observacion:        string;
    nombreArchivo:      string;
    calificacion:       number;
    tipoCalificacion:   string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

export interface Evaluado {
    apellidos:      string;
    oidUsuario:     number;
    departamento:   string;
    nombreCompleto: string;
    nombres:        string;
}

export interface Actividad {
    idActividad:      number;
    nombreActividad:  string;
    tipoActividad:    string;
    horasTotales:     number;
    periodoAcademico: string;
}

export interface LeccionesAprendida {
    oidLeccionAprendida: number;
    descripcion:         string;
}

export interface OdsSeleccionado {
    oidAutoevaluacionOds: number;
    oidOds:               number;
    nombre:               string;
    resultado:            string;
    documento:            null | string;
}

export interface OportunidadesMejora {
    oidOportunidadMejora: number;
    descripcion:          string;
}
