import { EstadoPeriodoAcademico } from "../base/estado-periodo-academico.model";


export interface PeriodoAcademicoResponse {
    oidPeriodoAcademico: number;
    oidEstadoPeriodoAcademico: number;
    idPeriodo: string;
    idPeriodoApi: string;
    estadoPeriodoAcademico: EstadoPeriodoAcademico;
    fechaInicio: string;
    fechaFin: string;
}