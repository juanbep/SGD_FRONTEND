import { PaginatedResponse, BaseResponse } from '../shared/shared.model';

export interface NombreFecha {
  oidNombreFecha: number;
  nombre: string;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaActualizacion: string | null;
  usuarioActualizacion: string | null;
}

export interface CrearNombreFecha {
  nombre: string;
}

export interface ActualizarNombreFecha {
  nombre: string;
}

export interface NombreFechaResponse extends PaginatedResponse<NombreFecha> {}
export interface NombreFechaItemResponse extends BaseResponse<NombreFecha> {}
