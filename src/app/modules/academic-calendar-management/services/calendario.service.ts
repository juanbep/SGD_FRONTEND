// services/calendario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Calendario,
  CrearCalendario,
  ActualizarCalendario,
  PaginatedResponse,
  BaseResponse,
} from '../models';
import { environment } from '../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private readonly apiUrl = `${environment.baseUrl}/calendarios`;

  constructor(private http: HttpClient) {}

  // ===============================
  // CREATE - Crear nuevo calendario
  // ===============================
  crearCalendario(
    calendario: CrearCalendario
  ): Observable<BaseResponse<Calendario>> {
    return this.http.post<BaseResponse<Calendario>>(this.apiUrl, calendario);
  }

  // ===============================
  // READ - Obtener calendarios paginados
  // ===============================
  obtenerCalendarios(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Calendario>>(this.apiUrl, {
      params,
    });
  }

  // ===============================
  // READ - Obtener calendario por ID
  // ===============================
  obtenerCalendarioPorId(
    oidcalendario: number
  ): Observable<BaseResponse<Calendario>> {
    const url = `${this.apiUrl}/${oidcalendario}`;
    return this.http.get<BaseResponse<Calendario>>(url);
  }

  // ===============================
  // UPDATE - Actualizar calendario
  // ===============================
  actualizarCalendario(
    oidcalendario: number,
    calendario: ActualizarCalendario
  ): Observable<BaseResponse<Calendario>> {
    const url = `${this.apiUrl}/${oidcalendario}`;
    return this.http.put<BaseResponse<Calendario>>(url, calendario);
  }

  // ===============================
  // DELETE - Eliminar calendario
  // ===============================
  eliminarCalendario(oidcalendario: number): Observable<BaseResponse<any>> {
    const url = `${this.apiUrl}/${oidcalendario}`;
    return this.http.delete<BaseResponse<any>>(url);
  }

  // ===============================
  // FILTROS ADICIONALES
  // ===============================

  // Buscar por año
  obtenerCalendariosPorAnio(
    anio: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    const params = new HttpParams()
      .set('anioCalendario', anio)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Calendario>>(this.apiUrl, {
      params,
    });
  }

  // Buscar por estado
  obtenerCalendariosPorEstado(
    estado: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    const params = new HttpParams()
      .set('estado', estado)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Calendario>>(this.apiUrl, {
      params,
    });
  }
}
