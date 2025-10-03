import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  UsuariosListResponse,
  GetUsuarioResponse,
  UsuarioFilters,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = `${environment.baseUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getUsuarios(filters: UsuarioFilters = {}): Observable<UsuariosListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<UsuariosListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getUsuarioById(oidUsuario: number): Observable<GetUsuarioResponse> {
    return this.http
      .get<GetUsuarioResponse>(`${this.apiUrl}/${oidUsuario}`)
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: UsuarioFilters): HttpParams {
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
    if (filters.identificacion?.trim()) {
      params = params.set('identificacion', filters.identificacion.trim());
    }
    if (filters.nombres?.trim()) {
      params = params.set('nombres', filters.nombres.trim());
    }
    if (filters.apellidos?.trim()) {
      params = params.set('apellidos', filters.apellidos.trim());
    }
    if (filters.username?.trim()) {
      params = params.set('username', filters.username.trim());
    }
    if (filters.correo?.trim()) {
      params = params.set('correo', filters.correo.trim());
    }

    // Filtros por detalles
    if (filters.facultad?.trim()) {
      params = params.set('facultad', filters.facultad.trim());
    }
    if (filters.departamento?.trim()) {
      params = params.set('departamento', filters.departamento.trim());
    }
    if (filters.programa?.trim()) {
      params = params.set('programa', filters.programa.trim());
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

    // Filtros por estado
    if (filters.oidEstadoUsuario !== undefined) {
      params = params.set('estadoUsuario', filters.oidEstadoUsuario.toString());
    }
    if (filters.estadoNombre?.trim()) {
      params = params.set('estadoNombre', filters.estadoNombre.trim());
    }

    // Filtros por rol
    if (filters.rolNombre?.trim()) {
      params = params.set('rolNombre', filters.rolNombre.trim());
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
    console.error('Error en UsuarioService:', error);
    return throwError(
      () => new Error(error.mensaje || 'Error en el servicio de usuarios')
    );
  }
}
