import { Injectable, inject } from '@angular/core';
import { UsuarioActividadCalendarioService } from './usuario-actividad-calendario.service';
import { BaseHelperService } from '../base-helper.service';
import {
  ValidarCupoData,
  ValidarCupoFilters,
} from '../../models/usuario-actividad-calendario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioActividadCalendarioHelperService {
  private usuarioActividadCalendarioService = inject(
    UsuarioActividadCalendarioService
  );
  private baseHelper = inject(BaseHelperService);

  async validarCupo(
    filters: ValidarCupoFilters
  ): Promise<ValidarCupoData | null> {
    return this.baseHelper.getDataFromResponse(
      this.usuarioActividadCalendarioService.validarCupo(filters)
    );
  }

  // Helper para obtener solo si puede asignar
  async puedeAsignar(filters: ValidarCupoFilters): Promise<boolean> {
    const resultado = await this.validarCupo(filters);
    return resultado?.puedeAsignar ?? false;
  }

  // Helper para obtener horas disponibles
  async getHorasDisponibles(filters: ValidarCupoFilters): Promise<number> {
    const resultado = await this.validarCupo(filters);
    return resultado?.horasDisponiblesUsuarioMenorCupo ?? 0;
  }
}
