export interface FuenteCoordinadorFormulario {
    oidFuente:              number;
    tipoCalificacion:       string;
    calificacion:           number;
    observacion:            string;
    informesAdministracion: InformesAdministracion[];
}

export interface InformesAdministracion {
    oidObjetivoComponente: number;
    calificacion:          number;
}
