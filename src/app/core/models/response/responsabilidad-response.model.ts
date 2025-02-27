import { Atributo } from '../base/atributo.model';
import { EstadoActividad } from '../base/estado-actividad.model';
import { Fuente } from '../base/fuente.model';
import { TipoActividad } from '../base/tipo-actividad.model';
import { UsuarioResponse } from './usuario-response.model';

export interface ResponsabilidadResponse {
  oidActividad: number;
  nombreActividad: string;
  estadoActividad: EstadoActividad;
  fuentes: Fuente[];
  evaluado: UsuarioResponse;
  tipoActividad: TipoActividad;
  horas: number;
  semanas: number;
  informeEjecutivo: boolean;
  fechaActualizacion: string;
  fechaCreacion: string;
}
