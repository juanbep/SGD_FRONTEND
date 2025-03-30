
export interface FuenteDocenteFormularioResponse {
    Fuente:              Fuente;
    firma:               string;
    screenshotSimca:     null;
    Descripcion:        string;
    odsSeleccionados:    OdsSeleccionado[];
    leccionesAprendidas: LeccionesAprendida[];
    oportunidadesMejora: OportunidadesMejora[];
}

interface Fuente {
    oidFuente:          number;
    evaluado:           Evaluado;
    evaluador:          Evaluado;
    observacion:        string;
    calificacion:       Number;
    nombreArchivo:      string;
    tipoCalificacion:   string;
    fechaCreacion:      Date;
    fechaActualizacion: Date;
}

interface Evaluado {
    apellidos:      string;
    nombreCompleto: string;
    nombres:        string;
}

interface LeccionesAprendida {
    oidLeccionAprendida: number;
    descripcion:         string;
}

interface OdsSeleccionado {
    oidAutoevaluacionOds: number;
    oidOds:               number;
    nombre:               string;
    resultado:            string;
    documento:            null | string;
}

interface OportunidadesMejora {
    oidOportunidadMejora: number;
    descripcion:          string;
}
