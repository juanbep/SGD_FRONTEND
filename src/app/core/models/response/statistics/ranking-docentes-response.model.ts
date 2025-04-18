export interface RankingDocentesResponse {
    oidPeriodo:    number;
    nombrePeriodo: string;
    departamentos: Departamento[];
}

export interface Departamento {
    nombre:   string;
    docentes: Docente[];
}

export interface Docente {
    oidUsuario:     number;
    nombre:         string;
    identificacion: string;
    calificacion:   number;
}
