import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  FechasListResponse,
  GetFechaResponse,
  CreateFechaResponse,
  UpdateFechaResponse,
  DeleteFechaResponse,
  FechaFilters,
  CreateFechaDto,
  UpdateFechaDto,
  DeleteFechaDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class FechasService {
  private readonly apiUrl = `${environment.baseUrl}/fechas`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getFechas(filters: FechaFilters = {}): Observable<FechasListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<FechasListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getFechaById(oidFecha: number): Observable<GetFechaResponse> {
    return this.http
      .get<GetFechaResponse>(`${this.apiUrl}/${oidFecha}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createFecha(fechaData: CreateFechaDto): Observable<CreateFechaResponse> {
    return this.http
      .post<CreateFechaResponse>(this.apiUrl, fechaData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateFecha(fechaData: UpdateFechaDto): Observable<UpdateFechaResponse> {
    const { oidFecha, ...updateData } = fechaData;

    return this.http
      .put<UpdateFechaResponse>(`${this.apiUrl}/${oidFecha}`, updateData)
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteFecha(deleteData: DeleteFechaDto): Observable<DeleteFechaResponse> {
    return this.http
      .delete<DeleteFechaResponse>(`${this.apiUrl}/${deleteData.oidFecha}`)
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: FechaFilters): HttpParams {
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
    if (filters.nombre?.trim()) {
      params = params.set('nombre', filters.nombre.trim());
    }

    // Filtros específicos
    if (filters.tipo?.trim()) {
      params = params.set('tipo', filters.tipo.trim());
    }
    if (filters.tipos && filters.tipos.length > 0) {
      params = params.set('tipos', filters.tipos.join(','));
    }
    if (filters.oidCalendario !== undefined) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }
    if (filters.nombreCalendario?.trim()) {
      params = params.set('nombreCalendario', filters.nombreCalendario.trim());
    }
    if (filters.oidNombreFecha !== undefined) {
      params = params.set('oidNombreFecha', filters.oidNombreFecha.toString());
    }

    // Filtros por rangos de fecha
    if (filters.fechaInicialDesde) {
      params = params.set('fechaInicialDesde', filters.fechaInicialDesde);
    }
    if (filters.fechaInicialHasta) {
      params = params.set('fechaInicialHasta', filters.fechaInicialHasta);
    }
    if (filters.fechaFinDesde) {
      params = params.set('fechaFinDesde', filters.fechaFinDesde);
    }
    if (filters.fechaFinHasta) {
      params = params.set('fechaFinHasta', filters.fechaFinHasta);
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
    console.error('Error en FechaService:', error);
    return throwError(
      () => new Error(error.mensaje || 'Error en el servicio de fechas')
    );
  }
}
