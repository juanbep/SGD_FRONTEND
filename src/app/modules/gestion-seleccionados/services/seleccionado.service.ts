import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Seleccionado,
  CrearSeleccionadoRequest,
  ActualizarSeleccionadoRequest,
  SeleccionadoFiltros,
  ApiResponse,
  PaginatedResponse,
  DeleteSeleccionadoResponse,
} from '../models/seleccionado.model';
import { environment } from '../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class SeleccionadoService {
  private readonly API_URL = `${environment.baseUrl}/seleccionado`;

  constructor(private http: HttpClient) {}

  // ========================================
  // CREATE
  // ========================================
  crear(
    request: CrearSeleccionadoRequest
  ): Observable<ApiResponse<Seleccionado>> {
    return this.http.post<ApiResponse<Seleccionado>>(this.API_URL, request);
  }

  // ========================================
  // READ - LISTAR CON FILTROS (PAGINADO)
  // ========================================
  listar(
    filtros: SeleccionadoFiltros
  ): Observable<ApiResponse<PaginatedResponse<Seleccionado>>> {
    let params = new HttpParams()
      .set('page', filtros.page.toString())
      .set('size', filtros.size.toString())
      .set('oidCalendario', filtros.oidCalendario.toString())
      .set('oidDepartamento', filtros.oidDepartamento.toString());

    // Filtros opcionales
    if (filtros.identificacion) {
      params = params.set('identificacion', filtros.identificacion);
    }
    if (filtros.nombreCompleto) {
      params = params.set('nombreCompleto', filtros.nombreCompleto);
    }
    if (filtros.correo) {
      params = params.set('correo', filtros.correo);
    }
    if (filtros.contratacion) {
      params = params.set('contratacion', filtros.contratacion);
    }
    if (filtros.dedicacion) {
      params = params.set('dedicacion', filtros.dedicacion);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Seleccionado>>>(
      this.API_URL,
      { params }
    );
  }

  // ========================================
  // READ - OBTENER POR ID
  // ========================================
  obtenerPorId(oidSeleccionado: number): Observable<ApiResponse<Seleccionado>> {
    return this.http.get<ApiResponse<Seleccionado>>(
      `${this.API_URL}/${oidSeleccionado}`
    );
  }

  // ========================================
  // UPDATE
  // ========================================
  actualizar(
    oidSeleccionado: number,
    request: ActualizarSeleccionadoRequest
  ): Observable<ApiResponse<Seleccionado>> {
    return this.http.put<ApiResponse<Seleccionado>>(
      `${this.API_URL}/${oidSeleccionado}`,
      request
    );
  }

  // ========================================
  // DELETE
  // ========================================
  eliminar(
    oidSeleccionado: number
  ): Observable<ApiResponse<DeleteSeleccionadoResponse>> {
    return this.http.delete<ApiResponse<DeleteSeleccionadoResponse>>(
      `${this.API_URL}/${oidSeleccionado}`
    );
  }
}
