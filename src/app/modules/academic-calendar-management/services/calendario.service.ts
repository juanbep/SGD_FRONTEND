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
  EstadoCalendario,
  FiltrosCalendario,
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
  // READ - Obtener calendario por ID
  // ===============================
  obtenerCalendarioPorId(
    oidcalendario: number
  ): Observable<BaseResponse<Calendario>> {
    const url = `${this.apiUrl}/${oidcalendario}`;
    return this.http.get<BaseResponse<Calendario>>(url);
  }

  // ===============================
  // READ - Obtener calendarios con filtros (POR IMPLEMENTAR)
  // ===============================
  obtenerCalendariosConFiltros(
    filtros: FiltrosCalendario
  ): Observable<PaginatedResponse<Calendario>> {
    let params = new HttpParams()
      .set('page', (filtros.page || 0).toString())
      .set('size', (filtros.size || 10).toString());

    // ✅ Filtro por estados múltiples
    if (filtros.estados && filtros.estados.length > 0) {
      // Opción 1: Como array separado por comas
      params = params.set('estados', filtros.estados.join(','));

      // Opción 2: Como múltiples parámetros (alternativa)
      // filtros.estados.forEach(estado => {
      //   params = params.append('estados', estado);
      // });
    }

    // ✅ Filtro por año
    if (filtros.anio) {
      params = params.set('anio', filtros.anio);
    }

    // ✅ Filtro por periodo
    if (filtros.periodo) {
      params = params.set('periodo', filtros.periodo.toString());
    }

    // ✅ Búsqueda general
    if (filtros.busqueda && filtros.busqueda.trim()) {
      params = params.set('busqueda', filtros.busqueda.trim());
    }

    // ✅ Ordenamiento
    if (filtros.ordenPor) {
      params = params.set('ordenPor', filtros.ordenPor);
    }

    if (filtros.orden) {
      params = params.set('orden', filtros.orden);
    }

    // ✅ Filtros por fecha (opcionales)
    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }

    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }

    console.log('Parámetros de filtro:', params.toString());

    return this.http.get<PaginatedResponse<Calendario>>(this.apiUrl, {
      params,
    });
  }

  // ===============================
  // MÉTODOS ESPECÍFICOS
  // ===============================

  // ✅ Solo por estados
  obtenerCalendariosPorEstados(
    estados: EstadoCalendario[],
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      estados,
      page,
      size,
    });
  }

  // ✅ Solo por año
  obtenerCalendariosPorAnio(
    anio: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      anio,
      page,
      size,
    });
  }

  // ✅ Solo por periodo
  obtenerCalendariosPorPeriodo(
    periodo: number,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      periodo,
      page,
      size,
    });
  }

  // ✅ Búsqueda con texto
  buscarCalendarios(
    busqueda: string,
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      busqueda,
      page,
      size,
    });
  }

  // ===============================
  // FILTROS COMUNES
  // ===============================
  obtenerCalendariosVigentes(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      estados: ['ACTIVO'],
      page,
      size,
      ordenPor: 'anioCalendario',
      orden: 'desc',
    });
  }

  obtenerCalendariosEnEspera(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      estados: ['APROBADO', 'PENDIENTE'],
      page,
      size,
      ordenPor: 'fechaCreacion',
      orden: 'desc',
    });
  }

  obtenerHistorialCalendarios(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Calendario>> {
    return this.obtenerCalendariosConFiltros({
      estados: ['DESHABILITADO'],
      page,
      size,
      ordenPor: 'fechaCreacion',
      orden: 'desc',
    });
  }
}
