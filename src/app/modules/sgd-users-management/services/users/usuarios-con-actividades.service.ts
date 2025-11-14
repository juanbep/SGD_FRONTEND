import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  UsuariosConActividadesResponse,
  UsuariosConActividadesFilters,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class UsuariosConActividadesService {
  private readonly apiUrl = `${environment.baseUrl}/departamentos/usuarios/actividades`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros (sin paginación)
  getUsuariosConActividades(
    filters: UsuariosConActividadesFilters = {}
  ): Observable<UsuariosConActividadesResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<UsuariosConActividadesResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: UsuariosConActividadesFilters): HttpParams {
    let params = new HttpParams();

    // Filtros de búsqueda general
    if (filters.searchTerm?.trim()) {
      params = params.set('search', filters.searchTerm.trim());
    }

    // Filtros por usuario
    if (filters.identificacion?.trim()) {
      params = params.set('identificacion', filters.identificacion.trim());
    }
    if (filters.nombres?.trim()) {
      params = params.set('nombres', filters.nombres.trim());
    }
    if (filters.apellidos?.trim()) {
      params = params.set('apellidos', filters.apellidos.trim());
    }

    // Filtros por departamento
    if (filters.oidDepartamento !== undefined) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }
    if (filters.nombreDepartamento?.trim()) {
      params = params.set(
        'nombreDepartamento',
        filters.nombreDepartamento.trim()
      );
    }

    if (filters.filtro?.trim()) {
      params = params.set('filtro', filters.filtro.trim());
    }

    // Filtros por detalles
    if (filters.facultad?.trim()) {
      params = params.set('facultad', filters.facultad.trim());
    }
    if (filters.categoria?.trim()) {
      params = params.set('categoria', filters.categoria.trim());
    }
    if (filters.contratacion?.trim()) {
      params = params.set('contratacion', filters.contratacion.trim());
    }
    if (filters.dedicacion?.trim()) {
      params = params.set('dedicacion', filters.dedicacion.trim());
    }
    if (filters.estudios?.trim()) {
      params = params.set('estudios', filters.estudios.trim());
    }

    // Filtros por rol
    if (filters.rolNombre?.trim()) {
      params = params.set('rolNombre', filters.rolNombre.trim());
    }

    // Filtros por horas
    if (filters.minHorasActividades !== undefined) {
      params = params.set('minHoras', filters.minHorasActividades.toString());
    }
    if (filters.maxHorasActividades !== undefined) {
      params = params.set('maxHoras', filters.maxHorasActividades.toString());
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en UsuariosConActividadesService:', error);
    return throwError(() => error);
  }
}
