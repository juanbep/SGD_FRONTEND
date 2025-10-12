import { PaginatedResponse, BaseResponse } from '../shared/shared.model';

export interface Fecha {
  oidFecha: number;
  oidNombreFecha: number;
  nombre: string;
  fechaInicial: string | null;
  fechaFin: string | null;
  tipo: TipoFecha;
  oidCalendario: number;
  nombreCalendario: string;
}

export type TipoFecha = 'RESALTADAS' | 'CLASES' | 'NO_RESALTADAS' | 'ADMINISTRATIVAS';

export interface CrearFecha {
  fechaInicial: string;
  fechaFin: string;
  tipo: TipoFecha;
  oidNombreFecha: number;
  oidCalendario: number;
}

export interface ActualizarFecha {
  fechaInicial: string;
  fechaFin: string;
  oidCalendario: number;
  oidNombreFecha: number;
  tipo: TipoFecha;
}

export interface FechaResponse extends PaginatedResponse<Fecha> {}
export interface FechaItemResponse extends BaseResponse<Fecha> {}
