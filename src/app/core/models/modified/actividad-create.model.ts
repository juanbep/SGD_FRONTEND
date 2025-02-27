import { Atributo } from "../base/atributo.model";

export interface ActividadCreate {
    tipoActividad: {
        oidTipoActividad: number;
    };
    oidEvaluador: number;
    oidEvaluado: number;
    oidEstadoActividad: number;
    nombreActividad: string;
    horas: number;
    semanas: number;
    informeEjecutivo: boolean;
    atributos: Atributo[];
}