import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import {
  DepartamentosListResponse,
  GetDepartamentoResponse,
  CreateDepartamentoResponse,
  UpdateDepartamentoResponse,
  DeleteDepartamentoResponse,
  DepartamentoFilters,
  CreateDepartamentoDto,
  UpdateDepartamentoDto,
  DeleteDepartamentoDto,
} from '../../models';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  private readonly apiUrl = `${environment.baseUrl}/departamentos`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros y paginación
  getDepartamentos(
    filters: DepartamentoFilters = {}
  ): Observable<DepartamentosListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<DepartamentosListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getDepartamentoById(
    oidDepartamento: number
  ): Observable<GetDepartamentoResponse> {
    return this.http
      .get<GetDepartamentoResponse>(`${this.apiUrl}/${oidDepartamento}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createDepartamento(
    departamentoData: CreateDepartamentoDto
  ): Observable<CreateDepartamentoResponse> {
    return this.http
      .post<CreateDepartamentoResponse>(this.apiUrl, departamentoData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateDepartamento(
    departamentoData: UpdateDepartamentoDto
  ): Observable<UpdateDepartamentoResponse> {
    const { oidDepartamento, ...updateData } = departamentoData;

    return this.http
      .put<UpdateDepartamentoResponse>(
        `${this.apiUrl}/${oidDepartamento}`,
        updateData
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteDepartamento(
    deleteData: DeleteDepartamentoDto
  ): Observable<DeleteDepartamentoResponse> {
    return this.http
      .delete<DeleteDepartamentoResponse>(
        `${this.apiUrl}/${deleteData.oidDepartamento}`
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: DepartamentoFilters): HttpParams {
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
    if (filters.facultad?.trim()) {
      params = params.set('facultad', filters.facultad.trim());
    }

    // Filtros específicos
    if (filters.jefeOidUsuario !== undefined) {
      params = params.set('jefeOidUsuario', filters.jefeOidUsuario.toString());
    }
    if (filters.jefeNombre?.trim()) {
      params = params.set('jefeNombre', filters.jefeNombre.trim());
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
    console.error('Error en DepartamentoService:', error);
    return throwError(
      () => new Error(error.mensaje || 'Error en el servicio de departamentos')
    );
  }
}
