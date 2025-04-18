import { Atributo } from '../base/atributo.model';
import { Fuente } from '../base/fuente.model';
import { TipoActividad } from '../base/tipo-actividad.model';
import { UsuarioResponse } from './usuario-response.model';

export interface ActividadResponse {
  oidActividad: number;
  tipoActividad: TipoActividad;
  oidProceso: number;
  oidEstadoActividad: number;
  nombreActividad: string;
  horas: number;
  semanas: number;
  informeEjecutivo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  fuentes: Fuente[];
  atributos: Atributo[];
  evaluador: UsuarioResponse;
  oidEvaluado: number;
  oidEvaluador: number;
}

