import { BaseResponse } from '../shared/shared.model';

// Filtros para validar cupo
export interface ValidarCupoFilters {
  oidTipoActividad: number;
  oidCargoActividad: number;
  oidCalendario: number;
  oidUsuario: number;
}

// Respuesta de validación de cupo
export interface ValidarCupoData {
  puedeAsignar: boolean;
  oidUsuarioMenorCupo: number;
  horasDisponiblesUsuarioMenorCupo: number;
  horasMaximasCargo: number;
  semanasMaximas: number | null;
}

// Tipo de respuesta completa
export type ValidarCupoResponse = BaseResponse<ValidarCupoData>;
