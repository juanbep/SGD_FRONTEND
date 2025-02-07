
// Interface to define the structure of the response of the academic periods
export interface AcademicPeriodResponse {
    content:          AcademicPeriod[];
    pageable:         Pageable;
    last:             boolean;
    totalPages:       number;
    totalElements:    number;
    first:            boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    empty:            boolean;
}

export interface AcademicPeriod {
    oidPeriodoAcademico:    number;
    estadoPeriodoAcademico: EstadoPeriodoAcademico;
    idPeriodo:              string;
    fechaInicio:            string;
    fechaFin:               string;
}

export interface EstadoPeriodoAcademico {
    oidEstadoPeriodoAcademico: number;
    nombre:                    string;
    fechaCreacion:             string;
    fechaActualizacion:        string;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}




// Interface to define the structure of the request to save a new academic period


export interface NewAcademicPeriod {
    idPeriodo:              string;
    fechaInicio:            string;
    fechaFin:               string;
    estadoPeriodoAcademico: EstadoNuevoPeriodoAcademico;
}

export interface EstadoNuevoPeriodoAcademico {
    oidEstadoPeriodoAcademico: number;
}
