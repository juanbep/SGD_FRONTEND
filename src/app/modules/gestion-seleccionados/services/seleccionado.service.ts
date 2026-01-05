import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  SeleccionadosListResponse,
  CreateSeleccionadoResponse,
  UpdateSeleccionadoResponse,
  DeleteSeleccionadoResponse,
  GetSeleccionadoResponse,
  CreateSeleccionadoDTO,
  UpdateSeleccionadoDTO,
  DeleteSeleccionadoDTO,
  SeleccionadoFilters,
} from '../models';
import { environment } from '../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class SeleccionadosService {
  private readonly apiUrl = `${environment.baseUrl}/seleccionado`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros
  getSeleccionados(
    filters: SeleccionadoFilters
  ): Observable<SeleccionadosListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<SeleccionadosListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getSeleccionadoById(
    oidSeleccionado: number
  ): Observable<GetSeleccionadoResponse> {
    return this.http
      .get<GetSeleccionadoResponse>(`${this.apiUrl}/${oidSeleccionado}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createSeleccionado(
    seleccionadoData: CreateSeleccionadoDTO
  ): Observable<CreateSeleccionadoResponse> {
    return this.http
      .post<CreateSeleccionadoResponse>(this.apiUrl, seleccionadoData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateSeleccionado(
    seleccionadoData: UpdateSeleccionadoDTO
  ): Observable<UpdateSeleccionadoResponse> {
    const { oidSeleccionado, ...updateData } = seleccionadoData;

    return this.http
      .put<UpdateSeleccionadoResponse>(
        `${this.apiUrl}/${oidSeleccionado}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteSeleccionado(
    deleteData: DeleteSeleccionadoDTO
  ): Observable<DeleteSeleccionadoResponse> {
    return this.http
      .delete<DeleteSeleccionadoResponse>(
        `${this.apiUrl}/${deleteData.oidSeleccionado}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: SeleccionadoFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtros obligatorios
    if (
      filters.oidCalendario !== undefined &&
      filters.oidCalendario !== null &&
      filters.oidCalendario !== ''
    ) {
      params = params.set('oidCalendario', filters.oidCalendario.toString());
    }
    if (
      filters.oidDepartamento !== undefined &&
      filters.oidDepartamento !== null &&
      filters.oidDepartamento !== ''
    ) {
      params = params.set(
        'oidDepartamento',
        filters.oidDepartamento.toString()
      );
    }

    // Filtros opcionales
    if (filters.identificacion?.trim()) {
      params = params.set('identificacion', filters.identificacion.trim());
    }
    if (filters.nombreCompleto?.trim()) {
      params = params.set('nombreCompleto', filters.nombreCompleto.trim());
    }
    if (filters.correo?.trim()) {
      params = params.set('correo', filters.correo.trim());
    }
    if (filters.contratacion?.trim()) {
      params = params.set('contratacion', filters.contratacion.trim());
    }
    if (filters.dedicacion?.trim()) {
      params = params.set('dedicacion', filters.dedicacion.trim());
    }

    // Ordenamiento
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en SeleccionadosService:', error);
    return throwError(() => error);
  }
}
