import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ConfiguracionesListResponse,
  CreateConfiguracionResponse,
  UpdateConfiguracionResponse,
  DeleteConfiguracionResponse,
  GetConfiguracionResponse,
  GetConfiguracionValorResponse,
  CreateConfiguracionDTO,
  UpdateConfiguracionDTO,
  DeleteConfiguracionDTO,
  ConfiguracionFilters,
} from '../models/configuracion.model';
import { environment } from '../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  private readonly apiUrl = `${environment.baseUrl}/configuraciones`;

  constructor(private http: HttpClient) {}

  // READ - Lista con filtros
  getConfiguraciones(
    filters: ConfiguracionFilters,
  ): Observable<ConfiguracionesListResponse> {
    let params = this.buildHttpParams(filters);

    return this.http
      .get<ConfiguracionesListResponse>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // GET BY ID
  getConfiguracionById(
    oidConfigGeneral: number,
  ): Observable<GetConfiguracionResponse> {
    return this.http
      .get<GetConfiguracionResponse>(`${this.apiUrl}/${oidConfigGeneral}`)
      .pipe(catchError(this.handleError));
  }

  // GET BY CLAVE - Devuelve solo el valor
  getConfiguracionByClave(
    clave: string,
  ): Observable<GetConfiguracionValorResponse> {
    return this.http
      .get<GetConfiguracionValorResponse>(`${this.apiUrl}/${clave}`)
      .pipe(catchError(this.handleError));
  }

  // CREATE
  createConfiguracion(
    configuracionData: CreateConfiguracionDTO,
  ): Observable<CreateConfiguracionResponse> {
    return this.http
      .post<CreateConfiguracionResponse>(this.apiUrl, configuracionData)
      .pipe(catchError(this.handleError));
  }

  // UPDATE
  updateConfiguracion(
    configuracionData: UpdateConfiguracionDTO,
  ): Observable<UpdateConfiguracionResponse> {
    const { oidConfigGeneral, ...updateData } = configuracionData;

    return this.http
      .put<UpdateConfiguracionResponse>(
        `${this.apiUrl}/${oidConfigGeneral}`,
        updateData,
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE
  deleteConfiguracion(
    deleteData: DeleteConfiguracionDTO,
  ): Observable<DeleteConfiguracionResponse> {
    return this.http
      .delete<DeleteConfiguracionResponse>(
        `${this.apiUrl}/${deleteData.oidConfigGeneral}`,
      )
      .pipe(catchError(this.handleError));
  }

  private buildHttpParams(filters: ConfiguracionFilters): HttpParams {
    let params = new HttpParams();

    // Paginación
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }

    // Filtros opcionales
    if (filters.clave?.trim()) {
      params = params.set('clave', filters.clave.trim());
    }
    if (filters.habilitado !== undefined) {
      params = params.set('habilitado', filters.habilitado.toString());
    }

    // Ordenamiento
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return params;
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en ConfiguracionService:', error);
    return throwError(() => error);
  }
}
