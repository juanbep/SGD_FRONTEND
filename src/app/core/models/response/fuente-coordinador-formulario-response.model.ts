export interface FuenteCoordinadorFormularioResponse {
    Fuente:                 Fuente;
    informesAdministracion: InformesAdministracion[];
}

export interface Fuente {
    oidFuente:          number;
    evaluado:           Evaluado;
    evaluador:          Evaluado;
    nombreActividad:    string;
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

export interface InformesAdministracion {
    calificacion:          number;
    oidObjetivoComponente: number;
}
