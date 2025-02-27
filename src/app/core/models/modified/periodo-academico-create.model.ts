export interface PeriodoAcademicoCreate {
    idPeriodo: string;
    fechaInicio: string;
    fechaFin: string;
    estadoPeriodoAcademico: {
        oidEstadoPeriodoAcademico: number
    }
}