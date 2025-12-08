import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments_sgd';
import {
  ValidarCupoFilters,
  ValidarCupoResponse,
} from '../../models/usuario-actividad-calendario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioActividadCalendarioService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.baseUrl}/usuario-actividad-calendario`;

  validarCupo(filters: ValidarCupoFilters): Observable<ValidarCupoResponse> {
    let params = new HttpParams();

    if (filters.oidTipoActividad) {
      params = params.set(
        'oidTipoActividad',
        filters.oidTipoActividad.toString()
      );
    }
    if (filters.oidCargoActividad) {
      params = params.set(
        'oidCargoActividad',
        filters.oidCargoActividad.toString()
      );
    }
    if (filters.oidCalendario) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }
    if (filters.oidUsuario) {
      params = params.set('oidUsuario', filters.oidUsuario.toString());
    }

    return this.http.get<ValidarCupoResponse>(`${this.API_URL}/validar-cupo`, {
      params,
    });
  }
}
