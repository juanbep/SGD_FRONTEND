import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  UsuariosDepartamentoListResponse,
  GetUsuarioDepartamentoResponse,
  UsuarioDepartamentoFilters,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class UsuarioDepartamentoService {
  private readonly apiUrl = `${environment.baseUrl}/departamentos/usuarios`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getUsuariosDepartamento(
    filters: UsuarioDepartamentoFilters = {}
  ): Observable<UsuariosDepartamentoListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<UsuariosDepartamentoListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID (asumiendo que el ID es el oidUsuario)
  getUsuarioDepartamentoById(
    oidUsuario: number
  ): Observable<GetUsuarioDepartamentoResponse> {
    return this.http
      .get<GetUsuarioDepartamentoResponse>(`${this.apiUrl}/${oidUsuario}`)
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: UsuarioDepartamentoFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

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

    // Ordenamiento
    if (filters.sortBy) {
      params = params.set('sort', filters.sortBy);
    }
    if (filters.sortDirection) {
      params = params.set('direction', filters.sortDirection);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en UsuarioDepartamentoService:', error);
    return throwError(() => error);
  }
}
