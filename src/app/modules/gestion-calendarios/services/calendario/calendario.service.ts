// services/calendario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CalendariosListResponse,
  GetCalendarioResponse,
  CreateCalendarioResponse,
  UpdateCalendarioResponse,
  DeleteCalendarioResponse,
  CalendarioFilters,
  CreateCalendarioDTO,
  UpdateCalendarioDTO,
  DeleteCalendarioDTO,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private readonly apiUrl = `${environment.baseUrl}/calendarios`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getCalendariosAcademicos(
    filters: CalendarioFilters = {}
  ): Observable<CalendariosListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<CalendariosListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getCalendarioAcademicoById(
    oidcalendario: number
  ): Observable<GetCalendarioResponse> {
    return this.http
      .get<GetCalendarioResponse>(`${this.apiUrl}/${oidcalendario}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createCalendarioAcademico(
    calendarioData: CreateCalendarioDTO
  ): Observable<CreateCalendarioResponse> {
    return this.http
      .post<CreateCalendarioResponse>(this.apiUrl, calendarioData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateCalendarioAcademico(
    calendarioData: UpdateCalendarioDTO
  ): Observable<UpdateCalendarioResponse> {
    const { oidcalendario, ...updateData } = calendarioData;

    return this.http
      .put<UpdateCalendarioResponse>(
        `${this.apiUrl}/${oidcalendario}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteCalendarioAcademico(
    deleteData: DeleteCalendarioDTO
  ): Observable<DeleteCalendarioResponse> {
    return this.http
      .delete<DeleteCalendarioResponse>(
        `${this.apiUrl}/${deleteData.oidcalendario}`
      )
      .pipe(catchError(this.handleError));
  }

  // Descargar calendario en PDF
  downloadCalendarioPdf(oidCalendario: number): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${oidCalendario}/pdf`, {
        responseType: 'blob', // Especificar que esperamos un blob
        observe: 'body',
      })
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: CalendarioFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtros de búsqueda
    if (filters.searchTerm?.trim()) {
      params = params.set('search', filters.searchTerm.trim());
    }
    if (filters.observacion?.trim()) {
      params = params.set('observacion', filters.observacion.trim());
    }

    // Filtros específicos
    if (filters.anioCalendario?.trim()) {
      params = params.set('anioCalendario', filters.anioCalendario.trim());
    }
    if (filters.numeroCalendario !== undefined) {
      params = params.set(
        'numeroCalendario',
        filters.numeroCalendario.toString()
      );
    }
    if (filters.estado?.trim()) {
      params = params.set('estado', filters.estado.trim());
    }
    if (filters.estados && filters.estados.length > 0) {
      params = params.set('estados', filters.estados.join(','));
    }

    // Filtros por fechas
    if (filters.fechaCreacionDesde) {
      params = params.set('fechaCreacionDesde', filters.fechaCreacionDesde);
    }
    if (filters.fechaCreacionHasta) {
      params = params.set('fechaCreacionHasta', filters.fechaCreacionHasta);
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
    console.error('Error en Calendario Académico Service:', error);
    return throwError(() => error);
  }
}
