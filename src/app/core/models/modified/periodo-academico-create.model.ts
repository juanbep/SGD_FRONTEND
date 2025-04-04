export interface PeriodoAcademicoCreate {
    idPeriodo: string;
    fechaInicio: string;
    idPeriodoApi: string;
    fechaFin: string;
    estadoPeriodoAcademico: {
        oidEstadoPeriodoAcademico: number
    }
}

