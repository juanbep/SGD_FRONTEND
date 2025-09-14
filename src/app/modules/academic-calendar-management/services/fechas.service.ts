import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Fecha,
  CrearFecha,
  ActualizarFecha,
  PaginatedResponse,
  BaseResponse,
  TipoFecha,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class FechasService {
  private readonly apiUrl = '/api/fechas';

  constructor(private http: HttpClient) {}

  // ===============================
  // CREATE - Crear nueva fecha
  // ===============================
  crearFecha(fecha: CrearFecha): Observable<BaseResponse<Fecha>> {
    return this.http.post<BaseResponse<Fecha>>(this.apiUrl, fecha);
  }

  // ===============================
  // READ - Obtener fechas paginadas
  // ===============================
  obtenerFechas(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Fecha>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Fecha>>(this.apiUrl, { params });
  }

  // ===============================
  // READ - Obtener fecha por ID
  // ===============================
  obtenerFechaPorId(oidFecha: number): Observable<BaseResponse<Fecha>> {
    const url = `${this.apiUrl}/${oidFecha}`;
    return this.http.get<BaseResponse<Fecha>>(url);
  }

  // ===============================
  // UPDATE - Actualizar fecha
  // ===============================
  actualizarFecha(
    oidFecha: number,
    fecha: ActualizarFecha
  ): Observable<BaseResponse<Fecha>> {
    const url = `${this.apiUrl}/${oidFecha}`;
    return this.http.put<BaseResponse<Fecha>>(url, fecha);
  }

  // ===============================
  // DELETE - Eliminar fecha
  // ===============================
  eliminarFecha(oidFecha: number): Observable<BaseResponse<any>> {
    const url = `${this.apiUrl}/${oidFecha}`;
    return this.http.delete<BaseResponse<any>>(url);
  }

  // ===============================
  // FILTROS ESPECÍFICOS
  // ===============================

  // Obtener fechas por calendario específico
  obtenerFechasPorCalendario(
    oidCalendario: number,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Fecha>> {
    const params = new HttpParams()
      .set('oidCalendario', oidCalendario.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Fecha>>(this.apiUrl, { params });
  }

  // Obtener fechas por tipo
  obtenerFechasPorTipo(
    tipo: TipoFecha,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Fecha>> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Fecha>>(this.apiUrl, { params });
  }

  // Obtener fechas por calendario y tipo (filtro combinado)
  obtenerFechasPorCalendarioYTipo(
    oidCalendario: number,
    tipo: TipoFecha,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Fecha>> {
    const params = new HttpParams()
      .set('oidCalendario', oidCalendario.toString())
      .set('tipo', tipo)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Fecha>>(this.apiUrl, { params });
  }

  // Buscar fechas por rango de fechas
  obtenerFechasPorRango(
    fechaInicio: string,
    fechaFin: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Fecha>> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Fecha>>(this.apiUrl, { params });
  }

  // ===============================
  // MÉTODOS UTILITARIOS
  // ===============================

  // Obtener todas las fechas de un calendario (sin paginación)
  obtenerTodasLasFechasDelCalendario(
    oidCalendario: number
  ): Observable<BaseResponse<Fecha[]>> {
    const params = new HttpParams()
      .set('oidCalendario', oidCalendario.toString())
      .set('size', '1000'); // Número grande para obtener todas

    return this.http.get<BaseResponse<Fecha[]>>(this.apiUrl, { params });
  }

  // Obtener fechas resaltadas de un calendario específico
  obtenerFechasResaltadas(
    oidCalendario: number
  ): Observable<PaginatedResponse<Fecha>> {
    return this.obtenerFechasPorCalendarioYTipo(oidCalendario, 'RESALTADAS');
  }

  // Obtener fechas de clases de un calendario específico
  obtenerFechasClases(
    oidCalendario: number
  ): Observable<PaginatedResponse<Fecha>> {
    return this.obtenerFechasPorCalendarioYTipo(oidCalendario, 'CLASES');
  }
}
