import { BaseResponse } from '../shared/shared.model';

// ========== RESPUESTA DE CAMBIO DE ESTADO ==========

export interface CambioEstadoData {
  totalNecesidades: number;
  oidPrograma?: number;
  estadoOrigen: string;
  calendario: number;
  estadoDestino: string;
}

// ========== PARÁMETROS PARA CAMBIO DE ESTADO ==========

export interface CambioEstadoParams {
  oidCalendario: number;
  oidPrograma?: number;
  oidDepartamento?: number;
}

// ========== DTO PARA CAMBIO DE ESTADO POR OID ==========

export interface CambioEstadoPorOidDTO {
  oidNecesidades: number[];
  estadoOrigen: string;
  estadoDestino: string;
}

// ========== ENUM DE ESTADOS (OPCIONAL - PARA MAYOR SEGURIDAD DE TIPOS) ==========

export enum EstadoNecesidad {
  BORRADOR = 'BORRADOR',
  EN_REVISION_SECRETARIO = 'EN_REVISION_SECRETARIO',
  EN_REVISION_JEFE = 'EN_REVISION_JEFE',
  NO_ASIGNADA = 'NO_ASIGNADA',
}

// ========== RESPONSE TYPE ==========

export type CambioEstadoResponse = BaseResponse<CambioEstadoData>;
